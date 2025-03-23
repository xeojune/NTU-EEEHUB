import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Friends, FriendsDocument } from "./schemas/friends.schema";
import { FollowUserDto } from './dtos/follow-user.dto';
import { UnfollowUserDto } from './dtos/unfollow-user.dto';
import { Logger } from "@nestjs/common";
import { User, UserDocument } from '../auth/schemas/user.schema';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface PopulatedUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    profileImg: string;
}

interface PopulatedFollow {
    follower: PopulatedUser;
    following: PopulatedUser;
    createdAt: Date;
}

interface PopulatedFollower {
    follower: PopulatedUser;
    following: Types.ObjectId;
    createdAt: Date;
}

interface PopulatedFollowing {
    follower: Types.ObjectId;
    following: PopulatedUser;
    createdAt: Date;
}

@Injectable()
export class FriendsService {
    private readonly logger = new Logger(FriendsService.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor(
        @InjectModel(Friends.name) private friendsModel: Model<FriendsDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
        this.s3Client = new S3Client({
            region: process.env.BUCKET_REGION,
        });
        this.bucketName = process.env.BUCKET_NAME!;
    }

    async followUser(followDto: FollowUserDto) {
        const { followerId, followingId } = followDto;

        if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followingId)) {
            throw new BadRequestException('Invalid user ID format');
        }

        const followerObjectId = new Types.ObjectId(followerId);
        const followingObjectId = new Types.ObjectId(followingId);

        if (followerId === followingId) {
            throw new BadRequestException('Users cannot follow themselves');
        }

        try {
            const [follower, following] = await Promise.all([
                this.userModel.findById(followerObjectId),
                this.userModel.findById(followingObjectId)
            ]);

            if (!follower || !following) {
                throw new NotFoundException('One or both users not found');
            }

            const existingFollow = await this.friendsModel.findOne({
                follower: followerObjectId,
                following: followingObjectId,
            });

            if (existingFollow) {
                throw new BadRequestException('Already following this user');
            }

            const newFollow = new this.friendsModel({
                follower: followerObjectId,
                following: followingObjectId,
            });

            const [savedFollow] = await Promise.all([
                newFollow.save(),
                this.userModel.findByIdAndUpdate(followerObjectId, { $inc: { followingCount: 1 } }),
                this.userModel.findByIdAndUpdate(followingObjectId, { $inc: { followerCount: 1 } })
            ]);

            const followedUser = await this.userModel.findById(followingObjectId)
                .select('name email profileImg')
                .lean();
            
            if (!followedUser) {
                throw new NotFoundException('Followed user not found');
            }

            this.logger.log(`User ${follower.name} successfully followed ${following.name}`);

            return {
                message: 'Successfully followed user',
                success: true,
                data: {
                    userId: followingId,
                    username: followedUser.name,
                    profileImg: followedUser.profileImg || '',
                    isFollowing: true,
                    followedAt: savedFollow.createdAt
                }
            };
        } catch (error) {
            this.logger.error('Error in followUser:', error.message);
            throw error;
        }
    }

    async unfollowUser(userId: string, unfollowUserDto: UnfollowUserDto) {
        const { targetUserId } = unfollowUserDto;

        if (userId === targetUserId) {
            throw new BadRequestException('Users cannot unfollow themselves');
        }

        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(targetUserId)) {
            throw new BadRequestException('Invalid user ID format');
        }

        const userObjectId = new Types.ObjectId(userId);
        const targetUserObjectId = new Types.ObjectId(targetUserId);

        try {
            const result = await this.friendsModel.findOneAndDelete({
                follower: userObjectId,
                following: targetUserObjectId,
            });

            if (!result) {
                throw new NotFoundException('Follow relationship not found');
            }

            // Update follower and following counts
            await Promise.all([
                this.userModel.findByIdAndUpdate(userObjectId, { $inc: { followingCount: -1 } }),
                this.userModel.findByIdAndUpdate(targetUserObjectId, { $inc: { followerCount: -1 } })
            ]);

            return {
                message: 'Successfully unfollowed user',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error('Error in unfollowUser:', error);
            throw new BadRequestException('Failed to unfollow user');
        }
    }

    async getFollowers(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const objectId = new Types.ObjectId(userId);

        // First get all users this person is following
        const following = await this.friendsModel
            .find({ follower: objectId })
            .lean()
            .exec();
        
        const followingIds = new Set(following.map(f => f.following.toString()));

        const followers = await this.friendsModel
            .find({ following: objectId })
            .populate<{ follower: PopulatedUser }>('follower', 'name email profileImg')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        const total = await this.friendsModel.countDocuments({ following: objectId });

        return {
            followers: followers.map(f => ({
                userId: f.follower._id.toString(),
                username: f.follower.name,
                profileImg: f.follower.profileImg || '',
                isFollowing: followingIds.has(f.follower._id.toString()) // Check if we're following this follower
                // followedAt: f.createdAt
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getFollowings(userId: string, page: number = 1, limit: number = 10) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user ID format');
        }

        const skip = (page - 1) * limit;
        const objectId = new Types.ObjectId(userId);

        try {
            const [followings, total] = await Promise.all([
                this.friendsModel
                    .find({ follower: objectId })
                    .populate<{ following: PopulatedUser }>('following', 'name email profileImg')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec(),
                this.friendsModel.countDocuments({ follower: objectId })
            ]);

            const formattedFollowings = await Promise.all(followings.map(async f => {
                let signedProfileImgUrl = '';
                if (f.following.profileImg) {
                    try {
                        const command = new GetObjectCommand({
                            Bucket: this.bucketName,
                            Key: f.following.profileImg
                        });
                        signedProfileImgUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
                    } catch (error) {
                        signedProfileImgUrl = `https://${this.bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${f.following.profileImg}`;
                    }
                }

                return {
                    userId: f.following._id.toString(),
                    username: f.following.name,
                    profileImg: signedProfileImgUrl || '',
                    isFollowing: true,
                    followedAt: f.createdAt
                };
            }));

            return {
                followings: formattedFollowings,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            this.logger.error('Error in getFollowings:', error.message);
            throw error;
        }
    }

    async getAllUsers(page: number = 1, limit: number = 10, currentUserId?: string) {
        const skip = (page - 1) * limit;
        
        try {
            if (!currentUserId) {
                throw new BadRequestException('Current user ID is required');
            }

            // First get all following relationships for current user
            const followingRelationships = await this.friendsModel
                .find({ 
                    follower: new Types.ObjectId(currentUserId)
                })
                .lean()
                .exec();

            // Convert following IDs to strings for comparison
            const followingIds = new Set(followingRelationships.map(f => f.following.toString()));

            // Get all users except current user
            const usersQuery = {
                _id: { 
                    $ne: new Types.ObjectId(currentUserId)
                }
            };

            // Get users and their relationships
            const [users, total] = await Promise.all([
                this.userModel
                    .find(usersQuery)
                    .select('name email profileImg')
                    .lean()
                    .exec(),
                this.userModel.countDocuments(usersQuery)
            ]);

            // Format users and generate signed URLs for profile images
            const formattedUsers = await Promise.all(users.map(async user => {
                let signedProfileImgUrl = '';
                if (user.profileImg) {
                    try {
                        const command = new GetObjectCommand({
                            Bucket: this.bucketName,
                            Key: user.profileImg
                        });
                        signedProfileImgUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
                    } catch (error) {
                        signedProfileImgUrl = `https://${this.bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${user.profileImg}`;
                    }
                }

                // Check if the current user is following this user
                const isFollowing = followingIds.has(user._id.toString());

                return {
                    userId: user._id.toString(),
                    username: user.name,
                    profileImg: signedProfileImgUrl || '',
                    isFollowing
                };
            }));

            // Apply pagination after formatting
            const paginatedUsers = formattedUsers.slice(skip, skip + limit);

            return {
                users: paginatedUsers,
                total: users.length,
                page,
                totalPages: Math.ceil(users.length / limit)
            };
        } catch (error) {
            this.logger.error('Error in getAllUsers:', error.message);
            throw error;
        }
    }
}
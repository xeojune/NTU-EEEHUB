import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uuidv7 } from 'uuidv7';
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';

dotenv.config();

interface PostWithUrl extends Post {
  imageUrls: string[];
}

@Injectable()
export class PostService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly userService: UserService,
  ) {
    this.s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
    });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  async uploadToS3(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      // Validate file extension
      const allowedExtensions = ['png', 'jpeg', 'jpg'];
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new Error('File extension not allowed. Extension should be png, jpg, or jpeg.');
      }

      // Validate file size (20MB limit)
      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        this.logger.error('File Size Exceed Error');
        throw new BadRequestException('File size exceeds the limit of 20MB');
      }

      const fileName = uuidv7();
      const key = `${fileName}.${fileExtension}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        await this.s3Client.send(new PutObjectCommand(uploadParams));
        return key;
      } catch (error) {
        this.logger.error('Error uploading to S3:', error);
        throw new InternalServerErrorException('S3 Uploading Error');
      }
    });

    return Promise.all(uploadPromises);
  }

  async createPost(caption: string, files: Express.Multer.File[], points: number, userId: string, username: string): Promise<Post> {
    try {
      const session = await this.postModel.startSession();
      session.startTransaction();

      // Deduct points from user first
      await this.userService.updatePoints(userId, points);

      // Upload all images to S3
      const imageKeys = await this.uploadToS3(files);

      // Create new post with multiple images
      const newPost = new this.postModel({
        username,
        caption,
        images: imageKeys,
        points,
        totalLikes: 0,
        totalComments: 0,
        userId // Add userId to track post ownership
      });

      const post = await newPost.save({ session });
      await session.commitTransaction();
      session.endSession();
      return post;
    } catch (error) {
      // If there's an error after points deduction but before post creation,
      // we should refund the points
      if (error.message !== 'Insufficient points') {
        try {
          await this.userService.updatePoints(userId, -points); // Refund points
        } catch (refundError) {
          console.error('Error refunding points:', refundError);
        }
      }
      throw error;
    }
  }

  async getPostCount(): Promise<number> {
    try {
      const postCount = await this.postModel.countDocuments({}).exec();
      return postCount;
    } catch (e) {
      console.error(`Error: ${e}`);
      throw e;
    }
  }

  // Get posts with pagination. 
  async getPost(page: number, limit: number = 50, username?: string): Promise<PostWithUrl[]> {
    try {
      // Validate page number
      if (page < 1) {
        throw new BadRequestException('Page number must be greater than 0');
      }

      // Validate limit
      if (limit < 1 || limit > 100) {
        throw new BadRequestException('Limit must be between 1 and 100');
      }

      const skip = (page - 1) * limit;
      
      // Build query conditions
      const queryConditions = username ? { username } : {};
      
      // Get total count for pagination info
      const totalCount = await this.postModel.countDocuments(queryConditions).exec();
      
      // Get posts with pagination
      const posts = await this.postModel
        .find(queryConditions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      const postsWithUrls = await Promise.all(
        posts.map(async (post) => {
          // Generate signed URLs for all images
          const imageUrlPromises = post.images.map(async (imageKey) => {
            const command = new GetObjectCommand({
              Bucket: this.bucketName,
              Key: imageKey
            });
            return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
          });

          const imageUrls = await Promise.all(imageUrlPromises);
          return {
            ...post.toObject(),
            imageUrls
          };
        })
      );

      return postsWithUrls;
    } catch (error) {
      this.logger.error(`Error in getPost: ${error.message}`);
      throw error;
    }
  }

  async deletePost(id: string, username: string): Promise<void> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.username !== username) {
      throw new Error('Unauthorized');
    }
    try {
      // Delete all images from S3
      const deletePromises = post.images.map(async (imageKey) => {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: imageKey,
        });
        return this.s3Client.send(command);
      });

      await Promise.all(deletePromises);

      // Delete post from database
      const result = await this.postModel.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new Error('Post not found in database');
      }
    } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
    }
  }
}

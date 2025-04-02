import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UserService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  //similar to how post service constructor works
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    this.s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
    });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  // find user by id
  async getUserById(id: string): Promise<{ name: string }> {
    const user = await this.userModel.findById(id).select('name').exec();
  
    if (!user) {
      throw new Error('User not found');
    }
    return { name: user.name };
  }

  // upload profile image
  async uploadProfileImage(userId: string, file: Express.Multer.File): Promise<string> {
    return this.uploadImage(userId, file, 'profile');
  }

  // upload background image
  async uploadBackgroundImage(userId: string, file: Express.Multer.File): Promise<string> {
    return this.uploadImage(userId, file, 'background');
  }

  private async uploadImage(userId: string, file: Express.Multer.File, type: string): Promise<string> {
    //validate file
    const allowedExtensions = ['png', 'jpeg', 'jpg']
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('File extension not allowed. Extension should be png, jpg, or jpeg.');
    }

    const maxSize = 20 * 1024 * 1024; //20MB
    if (file.size > maxSize) {
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
      // Upload the file to S3
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Generate a signed URL for the uploaded file
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });
      const signedUrl = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });

      // Update user document with the S3 key (not the signed URL)
      const updateField = type === 'profile' ? 'profileImg' : 'backgroundImg';
      await this.userModel.findByIdAndUpdate(userId, { [updateField]: key });
      
      return signedUrl;
    } catch (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }
  

  //update user points
  async updatePoints(userId: String, pointsToAdd: number, session?: ClientSession): Promise<number> {
    const updateOperation = { $inc: { totalPoints: pointsToAdd } };
    const options = { new: true }; // Return the updated document
    
    let user;
    if (session) {
      user = await this.userModel.findByIdAndUpdate(
        userId,
        updateOperation,
        { ...options, session }
      );
    } else {
      user = await this.userModel.findByIdAndUpdate(
        userId,
        updateOperation,
        options
      );
    }

    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's ranking based on new total points
    await this.updateUserRanking(userId.toString());

    return user.totalPoints;
  }

  // Deduct points from user
  async deductPoints(userId: string, points: number, session?: ClientSession): Promise<number> {
    let query = this.userModel.findById(userId);
    if(session) { 
      query = query.session(session);
    }
    const user = await query.exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has enough points
    if (user.totalPoints < points) {
      throw new Error('Insufficient points');
    }

    // Deduct points
    user.totalPoints -= points;
    await user.save(session ? { session } : {});
    return user.totalPoints;
  }

  // Add points to user
  async addPoints(userId: string, points: number, session?: ClientSession): Promise<number> {
    let query = this.userModel.findById(userId);
    if(session) { 
      query = query.session(session);
    }
    const user = await query.exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Add points
    user.totalPoints += points;
    await user.save(session ? { session } : {});
    return user.totalPoints;
  }

  private determineRanking(points: number): string {
    if (points >= 5000001) return 'Absolute God';
    if (points >= 4000000) return 'Guardian God';
    if (points >= 3000000) return 'Space God';
    if (points >= 2000000) return 'Sun God';
    if (points >= 1000000) return 'Moon God';
    if (points >= 600001) return 'Fire God';
    if (points >= 400000) return 'Wind God';
    if (points >= 200000) return 'Plant God';
    if (points >= 100001) return 'Superhuman';
    if (points >= 90000) return 'Supreme';
    if (points >= 75000) return 'Hero';
    if (points >= 50000) return 'Advanced';
    if (points >= 10000) return 'Intermediate';
    if (points >= 5000) return 'Novice';
    if (points >= 1501) return 'Civilian';
    return 'Beginner';
  }

  async updateUserRanking(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    const newRanking = this.determineRanking(user.totalPoints);
    if (user.ranking !== newRanking) {
        await this.userModel.findByIdAndUpdate(userId, { ranking: newRanking });
    }
  }

  async getUserProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(userId)
      .select('name email profileImg backgroundImg totalPoints ranking followerCount followingCount')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate signed URLs for profile and background images if they exist
    const profile = user.toObject();
    
    if (profile.profileImg) {
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: profile.profileImg
      });
      profile.profileImg = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
    }
    
    if (profile.backgroundImg) {
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: profile.backgroundImg
      });
      profile.backgroundImg = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
    }
    
    return profile;
  }

  async getUserProfileByUsername(username: string) {
    const user = await this.userModel.findOne({ name: username })
      .select('name email profileImg backgroundImg totalPoints')
      .exec();
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const profile = user.toObject();

    // Generate signed URLs for profile and background images if they exist (in order to access other peoples' profile image in S3)
    // Before we didn't have a signed URL, we directly accessed the profile image in S3
    if (profile.profileImg) {
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: profile.profileImg
      });
      profile.profileImg = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
    }
    
    if (profile.backgroundImg) {
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: profile.backgroundImg
      });
      profile.backgroundImg = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
    }

    return {
      id: user._id,
      name: user.name,
      profileImg: profile.profileImg,
      backgroundImg: profile.backgroundImg,
      totalPoints: user.totalPoints
    };
  }
}

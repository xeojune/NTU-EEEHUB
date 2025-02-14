import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      const imageUrl = `https://${this.bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

      //update user document with new image URL
      const updateField = type === 'profile' ? 'profileImage' : 'backgroundImage';
      await this.userModel.findByIdAndUpdate(userId, { [updateField]: imageUrl });
      
      return imageUrl;
    } catch (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }
  

  //update user points
  async updatePoints(userId: String, pointsToDeduct: number, session?: ClientSession): Promise<number> {
    let query = this.userModel.findById(userId);
    if(session) { 
      query = query.session(session);
    }
    const user = await query.exec();

    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.totalPoints < pointsToDeduct) {
      throw new Error('Insufficient points');
    }
    user.totalPoints -= pointsToDeduct;
    await user.save(session ? { session } : {});
    return user.totalPoints;
  }

  async getUserProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(userId)
      .select('name email profileImg backgroundImg totalPoints')
      .exec();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
}

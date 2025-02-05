import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import * as dotenv from 'dotenv';
import { uuidv7 } from 'uuidv7';

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

interface PostWithUrl extends Post {
  imageUrl: string;
}

@Injectable()
export class PostService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    this.s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
    });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  // Create newPost function
  async createPost(caption: string, file: Express.Multer.File, points: string): Promise<Post> {

    // Limiting Extension = image file (png, jpg, jpeg)
    const allowedExtensions = ['png', 'jpeg', 'jpg'];
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new Error('fileExtension not allowed. fileExtension should be png, jpg, jpeg.');
    }

    //Memory Limitation = 20MB
    const maxSize = 20 * 1024 * 1024; 

    if (file.size > maxSize) {
      throw new Error('File size exceeds the limit of 20MB');
    }

    // Generating a unique file name (not collide with other files in S3)
    const fileName = uuidv7();
    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName + '.' + fileExtension, // The name of the file in the S3 bucket
      Body: file.buffer, // The file buffer
      ContentType: file.mimetype,
    };

    try {
        // Upload the file to S3
        await this.s3Client.send(new PutObjectCommand(uploadParams));
        console.log('Image uploaded successfully to S3');
  
        // Save the post in MongoDB
        const newPost = new this.postModel({
          caption,
          image: fileName + '.' + fileExtension, // Store the S3 file key
          points,
          totalLikes: 0,
          totalComments: 0
        });
        
        return newPost.save();
      } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw new Error('Failed to upload image to S3');
    }
  }

  //getPost service
  async getPost(): Promise<PostWithUrl[]> {
    const posts = await this.postModel.find().sort({ createdAt: -1 }).exec();
    
    const postsWithUrls: PostWithUrl[] = await Promise.all(
      posts.map(async (post) => {
        const getObjectParams = {
          Bucket: this.bucketName,
          Key: post.image,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 600 });
        
        return {
          ...post.toObject(),
          imageUrl: url
        };
      })
    );
    
    return postsWithUrls;
  }

  async deletePost(id: string): Promise<void> {
    // Find the post first
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new Error('Post not found');
    }

    try {
      // Delete from S3 first
      const params = {
        Bucket: this.bucketName,
        Key: post.image,
      };
      
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);

      // If S3 deletion succeeds, delete from database
      const result = await this.postModel.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        throw new Error('Post not found in database');
      }
    } catch (error) {
      // If it's our custom error, rethrow it
      if (error.message === 'Post not found in database') {
        throw error;
      }
      
      console.error('Error in deletePost:', error);
      if (error.name === 'S3ServiceException') {
        throw new Error('Failed to delete image from S3');
      }
      throw new Error('Failed to delete post');
    }
  }
}

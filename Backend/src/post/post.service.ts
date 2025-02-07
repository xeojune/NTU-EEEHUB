import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uuidv7 } from 'uuidv7';
import * as dotenv from 'dotenv';

dotenv.config();

interface PostWithUrl extends Post {
  imageUrls: string[];
}

@Injectable()
export class PostService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
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
        throw new Error('File size exceeds the limit of 20MB');
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
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload image to S3');
      }
    });

    return Promise.all(uploadPromises);
  }

  async createPost(caption: string, files: Express.Multer.File[], points: string, username: string): Promise<Post> {
    try {
      // Upload all images to S3
      const imageKeys = await this.uploadToS3(files);

      // Create new post with multiple images
      const newPost = new this.postModel({
        username,
        caption,
        images: imageKeys,
        points,
        totalLikes: 0,
        totalComments: 0
      });

      return await newPost.save();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async getPost(): Promise<PostWithUrl[]> {
    try {
      const posts = await this.postModel.find().sort({ createdAt: -1 }).exec();
      
      const postsWithUrls = await Promise.all(
        posts.map(async (post) => {
          // Generate signed URLs for all images
          const imageUrlPromises = post.images.map(async (imageKey) => {
            const command = new GetObjectCommand({
              Bucket: this.bucketName,
              Key: imageKey,
            });
            return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
          });

          const imageUrls = await Promise.all(imageUrlPromises);
          
          return {
            ...post.toObject(),
            imageUrls,
          };
        })
      );
      
      return postsWithUrls;
    } catch (error) {
      console.error('Error getting posts with URLs:', error);
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

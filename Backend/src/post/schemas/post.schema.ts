import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  caption: string;

  @Prop({ required: true })
  images: string[];  // Store the S3 key (filename)

  @Prop({ required: true, min: 0, type: Number })
  points: number; // Total points allocated to the post

  @Prop({ required: true, min: 0, type: Number })
  remainingPoints: number; // Points available for distribution

  @Prop({ default: 0, type: Number })
  distributedPoints: number;  // Track points that have been distributed

  @Prop({ default: 0, type: Number })
  totalLikes: number;  // Track total number of likes on the post

  @Prop({ default: 0 })
  totalComments: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// We'll use MongoDB's _id as our postId

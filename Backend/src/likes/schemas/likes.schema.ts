import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Post } from 'src/post/schemas/post.schema';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  postId: Post;

  @Prop({ required: true, default: false })
  isLiked: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Create a compound index to ensure a user can only have one like record per post
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
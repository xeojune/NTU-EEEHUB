import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ id: true,timestamps: true })
export class Post {
  @Prop({ required: true })
  caption: string;

  @Prop({ required: true })
  image: string;  // Store the S3 key (filename)

  @Prop({ required: true, type: Number })
  points: number;

  @Prop({ default: 0 })
  totalLikes: number;

  @Prop({ default: 0 })
  totalComments: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

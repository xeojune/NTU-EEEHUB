import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OpenChatDocument = OpenChat & Document;

@Schema()
export class OpenChat {
  _id: Types.ObjectId;

  @Prop({ required: true })
  roomName: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  openChatAvatar: string;

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({ type: [{ sender: String, message: String, timestamp: Date }] })
  messages: Array<{
    sender: string;
    message: string;
    timestamp: Date;
  }>;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OpenChatSchema = SchemaFactory.createForClass(OpenChat);
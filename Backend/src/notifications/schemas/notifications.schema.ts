import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  FOLLOW = 'follow',
  LIKE = 'like',
  COMMENT = 'comment',
  MENTION = 'mention',
  GROUP_INVITE = 'group_invite',
  GROUP_JOIN = 'group_join',
  NEW_POST = 'new_post'
}

export enum NotificationScope {
  SINGLE = 'single',    // For notifications with one recipient (follow, like, etc.)
  FOLLOWERS = 'followers' // For notifications to all followers (new post)
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  recipients: User[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true, enum: NotificationScope })
  scope: NotificationScope;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Boolean], default: [] })
  read: boolean[];

  @Prop({ type: Types.ObjectId, refPath: 'entityType' })
  entityId: Types.ObjectId;

  @Prop({ type: String, enum: ['Post', 'Comment', 'Group'] })
  entityType: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
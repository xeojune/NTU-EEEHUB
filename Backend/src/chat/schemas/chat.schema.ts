import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema()
export class ChatMessage extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: User;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    receiver: User;

    @Prop({ required: true })
    content: string;

    @Prop({ default: 'text' })
    messageType: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    readBy: User[];

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
    chatRoom: Types.ObjectId;
}

@Schema()
export class ChatRoom extends Document {
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    participants: User[];

    @Prop({ default: Date.now })
    lastActivity: Date;

    @Prop({ default: '' })
    lastMessage: string;

    @Prop({ default: false })
    isGroupChat: boolean;

    @Prop({ default: '' })
    groupName: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    groupAdmin: User;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
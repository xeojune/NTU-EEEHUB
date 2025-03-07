import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { ChatMessage, ChatRoom } from './schemas/chat.schema';
import { User } from '../auth/schemas/user.schema';

interface PopulatedUser {
    _id: Types.ObjectId;
    name: string;
    profileImg: string;
}

interface PopulatedMessage extends Document {
    _id: Types.ObjectId;
    sender: PopulatedUser;
    receiver: PopulatedUser;
    content: string;
    createdAt: Date;
    chatRoom: Types.ObjectId;
}

@Injectable()
export class ChatService {
    private logger = new Logger('ChatService');
    constructor(
        @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>,
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    ) {}

    async createMessage(senderId: string, receiverId: string, content: string, roomId: string) {
        const message = new this.chatMessageModel({
            sender: senderId,
            receiver: receiverId,
            content,
            chatRoom: roomId,
        });
        const savedMessage = await message.save();
        
        // Update the chat room's last activity and message
        await this.chatRoomModel.findByIdAndUpdate(roomId, {
            lastActivity: new Date(),
            lastMessage: content,
        });

        return savedMessage;
    }

    async findExistingChatRoom(participants: string[]): Promise<ChatRoom | null> {
        // Sort participants to ensure consistent order for query
        const sortedParticipants = [...participants].sort();
        return await this.chatRoomModel.findOne({
            participants: { $all: sortedParticipants },
            isGroupChat: false
        }).exec();
    }

    async createChatRoom(participants: string[], isGroup: boolean = false, groupName: string = '') {
        try {
            // For 1-on-1 chats, check if room already exists
            if (!isGroup && participants.length === 2) {
                const existingRoom = await this.findExistingChatRoom(participants);
                if (existingRoom) {
                    return existingRoom;
                }
            }

            const chatRoom = new this.chatRoomModel({
                participants,
                isGroupChat: isGroup,
                groupName,
            });
            return await chatRoom.save();
        } catch (error) {
            this.logger.error(`Error creating chat room: ${error.message}`);
            throw error;
        }
    }

    async getChatHistory(roomId: string) {
        try {
            const messages = await this.chatMessageModel
                .find({ chatRoom: roomId })
                .populate('sender', 'name profileImg _id')
                .populate('receiver', 'name profileImg _id')
                .sort({ createdAt: 1 })
                .exec() as PopulatedMessage[];

            return messages.map(msg => ({
                _id: msg._id.toString(),
                from: msg.sender._id.toString(),
                to: msg.receiver._id.toString(),
                content: msg.content,
                timestamp: msg.createdAt,
                roomId: msg.chatRoom.toString(),
                sender: {
                    _id: msg.sender._id.toString(),
                    name: msg.sender.name,
                    profileImg: msg.sender.profileImg
                },
                receiver: {
                    _id: msg.receiver._id.toString(),
                    name: msg.receiver.name,
                    profileImg: msg.receiver.profileImg
                }
            }));
        } catch (error) {
            this.logger.error(`Error getting chat history: ${error.message}`);
            throw error;
        }
    }

    async getUserChatRooms(userId: string) {
        return await this.chatRoomModel
            .find({ participants: userId })
            .populate('participants', 'name profileImg')
            .sort({ lastActivity: -1 })
            .exec();
    }

    async markMessagesAsRead(roomId: string, userId: string) {
        return await this.chatMessageModel.updateMany(
            {
                chatRoom: roomId,
                receiver: userId,
                isRead: false,
            },
            { isRead: true }
        );
    }

    async getChatRoomById(roomId: string): Promise<ChatRoom | null> {
        try {
            return await this.chatRoomModel.findById(roomId).exec();
        } catch (error) {
            return null;
        }
    }
}
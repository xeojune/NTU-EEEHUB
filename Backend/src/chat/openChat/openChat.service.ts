import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenChat, OpenChatDocument } from './schemas/openChat.schema';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uuidv7 } from 'uuidv7';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OpenChatService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @InjectModel(OpenChat.name) private openChatModel: Model<OpenChatDocument>,
  ) {
    this.s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
    });
    this.bucketName = process.env.BUCKET_NAME!;
  }

  async uploadAvatarToS3(file: Express.Multer.File): Promise<string> {
    // Validate file extension
    const allowedExtensions = ['png', 'jpeg', 'jpg'];
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('File extension not allowed. Extension should be png, jpg, or jpeg.');
    }

    // Validate file size (20MB limit)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      this.logger.error('File Size Exceed Error');
      throw new BadRequestException('File size exceeds the limit of 20MB');
    }

    const fileName = uuidv7();
    const key = `openchat-avatars/${fileName}.${fileExtension}`;

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
      this.logger.error('Error uploading to S3:', error);
      throw new InternalServerErrorException('S3 Uploading Error');
    }
  }

  async getSignedAvatarUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      this.logger.error('Error generating signed URL:', error);
      throw new InternalServerErrorException('Error generating signed URL');
    }
  }

  async createRoom(roomName: string, userId: string, avatar?: Express.Multer.File): Promise<OpenChatDocument> {
    let avatarKey: string | undefined;

    if (avatar) {
      avatarKey = await this.uploadAvatarToS3(avatar);
    }

    const newRoom = new this.openChatModel({
      roomName,
      createdBy: userId,
      participants: [userId],
      openChatAvatar: avatarKey,
    });
    
    const savedRoom = await newRoom.save();
    
    // Convert the room to a plain object so we can modify it
    const roomObject = savedRoom.toObject();
    
    // Generate signed URL if there's an avatar
    if (roomObject.openChatAvatar) {
      roomObject.openChatAvatar = await this.getSignedAvatarUrl(roomObject.openChatAvatar);
    }
    
    return roomObject;
  }

  async joinRoom(roomId: string, userId: string): Promise<OpenChatDocument> {
    const room = await this.openChatModel.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Initialize participants array if it doesn't exist
    if (!room.participants) {
      room.participants = [];
    }

    // Only add the user if they're not already in participants
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      await room.save();
    }

    // If room has an avatar, generate signed URL
    if (room.openChatAvatar) {
      const roomObject = room.toObject();
      roomObject.participants = roomObject.participants || [];
      roomObject.openChatAvatar = await this.getSignedAvatarUrl(room.openChatAvatar);
      return roomObject;
    }

    const roomObject = room.toObject();
    roomObject.participants = roomObject.participants || [];
    return roomObject;
  }

  async leaveRoom(roomId: string, userId: string): Promise<OpenChatDocument> {
    const updatedRoom = await this.openChatModel.findByIdAndUpdate(
      roomId,
      { $pull: { participants: userId } },
      { new: true },
    ).exec();
    
    if (!updatedRoom) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    
    const roomObj = updatedRoom.toObject();
    roomObj.participants = roomObj.participants || [];
    if (roomObj.openChatAvatar) {
      roomObj.openChatAvatar = await this.getSignedAvatarUrl(roomObj.openChatAvatar);
    }
    
    return roomObj;
  }

  async addMessage(roomId: string, userId: string,message: string): Promise<OpenChatDocument> {
    const updatedRoom = await this.openChatModel.findByIdAndUpdate(
      roomId,
      {
        $push: {
          messages: {
            sender: userId,
            message,
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    ).exec();
    
    if (!updatedRoom) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    
    const roomObj = updatedRoom.toObject();
    roomObj.participants = roomObj.participants || [];
    if (roomObj.openChatAvatar) {
      roomObj.openChatAvatar = await this.getSignedAvatarUrl(roomObj.openChatAvatar);
    }
    
    return roomObj;
  }

  async getRoomById(roomId: string): Promise<OpenChatDocument> {
    const room = await this.openChatModel.findById(roomId).exec();
    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }

    const roomObj = room.toObject();
    roomObj.participants = roomObj.participants || [];
    if (roomObj.openChatAvatar) {
      roomObj.openChatAvatar = await this.getSignedAvatarUrl(roomObj.openChatAvatar);
    }
    
    return roomObj;
  }

  async getAllRooms(): Promise<OpenChatDocument[]> {
    const rooms = await this.openChatModel.find().exec();
    
    // Generate signed URLs for all rooms with avatars
    const roomsWithSignedUrls = await Promise.all(
      rooms.map(async (room) => {
        const roomObj = room.toObject();
        roomObj.participants = roomObj.participants || [];
        if (roomObj.openChatAvatar) {
          roomObj.openChatAvatar = await this.getSignedAvatarUrl(roomObj.openChatAvatar);
        }
        return roomObj;
      })
    );
    
    return roomsWithSignedUrls;
  }
}
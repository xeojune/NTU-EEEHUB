import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenChatService } from './openChat.service';
import { OpenChatDocument } from './schemas/openChat.schema';
import { memoryStorage } from 'multer';

@Controller('api/open-chat')
export class OpenChatController {
  constructor(private readonly openChatService: OpenChatService) {}

  @Get('rooms')
  async getAllRooms(): Promise<OpenChatDocument[]> {
    try {
      console.log('Getting all rooms from controller');
      const rooms = await this.openChatService.getAllRooms();
      console.log('Found rooms:', rooms);
      return rooms;
    } catch (error) {
      console.error('Error getting rooms:', error);
      throw error;
    }
  }

  @Get('rooms/:roomId')
  async getRoomById(@Param('roomId') roomId: string): Promise<OpenChatDocument> {
    return this.openChatService.getRoomById(roomId);
  }

  @Post('rooms')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only jpg, jpeg, and png files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
      },
    })
  )
  async createRoom(
    @Body('roomName') roomName: string,
    @Body('userId') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<OpenChatDocument> {
    return this.openChatService.createRoom(roomName, userId, avatar);
  }
}
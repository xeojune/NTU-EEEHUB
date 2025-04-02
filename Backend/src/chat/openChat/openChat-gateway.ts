import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OpenChatService } from './openChat.service';
import { OpenChat, OpenChatDocument } from './schemas/openChat.schema';
import { Types } from 'mongoose';

interface CreateRoomDto {
  roomName: string;
  userId: string;
}

interface JoinRoomDto {
  roomId: string;
  userId: string;
}

interface MessageDto {
  roomId: string;
  userId: string;
  message: string;
}

export interface RoomResponse {
  _id: string;
  roomName: string;
  createdBy: string;
  participants: string[];
  messages: Array<{
    sender: string;
    message: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  openChatAvatar?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/socket',
})
export class OpenChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly connectedUsers = new Map<string, string[]>(); // socketId -> roomIds

  constructor(private readonly openChatService: OpenChatService) {}

  handleConnection(client: Socket) {
    console.log('Client connected to OpenChatGateway:', client.id);
    this.connectedUsers.set(client.id, []);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected from OpenChatGateway:', client.id);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('createOpenRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateRoomDto,
  ): Promise<RoomResponse> {
    console.log('Received createOpenRoom request:', data);
    try {
      const room = await this.openChatService.createRoom(data.roomName, data.userId);
      console.log('Room created successfully:', room);
      client.join(room._id.toString());
      
      const roomResponse: RoomResponse = {
        ...room,
        _id: room._id.toString()
      };
      
      console.log('Emitting roomCreated event with:', roomResponse);
      this.server.emit('roomCreated', roomResponse);
      
      return roomResponse;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  @SubscribeMessage('joinOpenRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ): Promise<RoomResponse> {
    console.log('Received joinOpenRoom request:', data);
    try {
      const room = await this.openChatService.joinRoom(data.roomId, data.userId);
      console.log('Client', client.id, 'joining room:', data.roomId);
      
      // Add room to user's joined rooms
      const userRooms = this.connectedUsers.get(client.id) || [];
      if (!userRooms.includes(data.roomId)) {
        userRooms.push(data.roomId);
        this.connectedUsers.set(client.id, userRooms);
      }
      
      client.join(data.roomId);
      
      const roomResponse: RoomResponse = {
        ...room,
        _id: room._id.toString()
      };

      this.server.to(data.roomId).emit('userJoined', {
        userId: data.userId,
        room: roomResponse,
      });
      return roomResponse;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  @SubscribeMessage('leaveOpenRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ): Promise<RoomResponse> {
    console.log('Received leaveOpenRoom request:', data);
    const room = await this.openChatService.leaveRoom(data.roomId, data.userId);
    client.leave(data.roomId);

    const roomResponse: RoomResponse = {
      ...room,
      _id: room._id.toString()
    };

    this.server.to(data.roomId).emit('userLeft', {
      userId: data.userId,
      room: roomResponse,
    });
    return roomResponse;
  }

  @SubscribeMessage('sendOpenMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDto,
  ): Promise<RoomResponse> {
    console.log('Received sendOpenMessage request:', data);
    try {
      const room = await this.openChatService.addMessage(
        data.roomId,
        data.userId,
        data.message,
      );
      console.log('Message added to room:', room);
      
      const roomResponse: RoomResponse = {
        ...room,
        _id: room._id.toString()
      };
      
      // Broadcast to all clients in the room, including sender
      console.log('Broadcasting message to room:', data.roomId);
      this.server.to(data.roomId).emit('newMessage', roomResponse);
      
      return roomResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from './chat.service';

interface PrivateMessage {
  to: string;
  content: string;
  roomId?: string;
}

interface UserConnection {
  userId: string;
  socketId: string;
  name: string;
  profileImg: string;
}

interface MessagePayload {
  _id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  roomId: string;
  sender: {
    _id: string;
    name: string;
    profileImg: string;
  };
  receiver: {
    _id: string;
    name: string;
    profileImg: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: unknown;
}

interface SuccessResponse {
  success: true;
  message: MessagePayload;
  roomId: string;
}

type MessageResponse = SuccessResponse | ErrorResponse;

@WebSocketGateway(3002, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],  
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger = new Logger('ChatGateway');
    private userSocketMap = new Map<string, UserConnection>();

    constructor(private chatService: ChatService) {}

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`);
        // Remove user from connections and notify others
        for (const [userId, connection] of this.userSocketMap.entries()) {
            if (connection.socketId === client.id) {
                this.userSocketMap.delete(userId);
                this.logger.debug(`User ${userId} (${connection.name}) disconnected`);
                // Notify others that user went offline
                this.server.emit('user_offline', userId);
                // Broadcast updated online users list
                this.broadcastOnlineUsers();
                break;
            }
        }
    }

    @SubscribeMessage('join_chat')
    handleJoinChat(
        @MessageBody() userData: { userId: string; name: string; profileImg: string },
        @ConnectedSocket() client: Socket
    ): { status: string } {
        try {
            if (!userData?.userId || !userData?.name) {
                throw new Error('Invalid user data provided');
            }

            this.userSocketMap.set(userData.userId, {
                userId: userData.userId,
                socketId: client.id,
                name: userData.name,
                profileImg: userData.profileImg || ''
            });

            this.logger.debug(`User joined: ${userData.name} (${userData.userId})`);

            this.broadcastOnlineUsers();
            return { status: 'joined' };
        } catch (error) {
            this.logger.error(`Error in join_chat: ${error.message}`);
            return { status: 'error' };
        }
    }

    @SubscribeMessage('private_message')
    async handlePrivateMessage(
        @MessageBody() message: PrivateMessage,
        @ConnectedSocket() client: Socket
    ): Promise<MessageResponse> {
        try {
            // Validate message data
            if (!message?.to || !message?.content) {
                throw new Error('Invalid message format');
            }

            const senderConnection = Array.from(this.userSocketMap.entries())
                .find(([_, conn]) => conn.socketId === client.id);
            
            if (!senderConnection) {
                return { error: 'Sender not found' };
            }

            const [senderId, sender] = senderConnection;
            const receiverConnection = this.userSocketMap.get(message.to);

            // Create or get chat room
            let roomId = message.roomId;
            let chatRoom;

            if (!roomId) {
                // Check for existing room first
                chatRoom = await this.chatService.findExistingChatRoom([senderId, message.to]);
                
                if (!chatRoom) {
                    // Create new room only if one doesn't exist
                    chatRoom = await this.chatService.createChatRoom([senderId, message.to]);
                }
                
                if (!chatRoom?._id) {
                    throw new Error('Failed to get or create chat room');
                }
                roomId = chatRoom._id.toString();
            } else {
                // Verify existing room
                chatRoom = await this.chatService.getChatRoomById(roomId);
                if (!chatRoom) {
                    return { error: 'Chat room not found' };
                }
            }

            // Save message to database
            const savedMessage = await this.chatService.createMessage(
                senderId,
                message.to,
                message.content,
                roomId
            );

            if (!savedMessage?._id) {
                throw new Error('Failed to save message');
            }

            const receiver = this.userSocketMap.get(message.to);
            if (!receiver) {
                return { error: 'Receiver not found' };
            }

            // Prepare message payload
            const messagePayload: MessagePayload = {
                _id: savedMessage._id.toString(),
                from: senderId,
                to: message.to,
                content: message.content,
                timestamp: new Date(),
                roomId: roomId,
                sender: {
                    _id: senderId,
                    name: sender.name,
                    profileImg: sender.profileImg
                },
                receiver: {
                    _id: message.to,
                    name: receiver.name,
                    profileImg: receiver.profileImg
                }
            };

            // Send to recipient if online
            if (receiverConnection?.socketId) {
                this.server.to(receiverConnection.socketId).emit('private_message', messagePayload);
            }

            // Send back to sender
            this.server.to(client.id).emit('private_message', messagePayload);

            return {
                success: true,
                message: messagePayload,
                roomId
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logger.error(`Error handling private message: ${errorMessage}`);
            return {
                error: 'Failed to process message',
                details: errorMessage
            };
        }
    }

    @SubscribeMessage('get_chat_history')
    async handleGetChatHistory(
        @MessageBody() data: { roomId: string },
        @ConnectedSocket() client: Socket
    ) {
        const history = await this.chatService.getChatHistory(data.roomId);
        client.emit('chat_history', history);
        return { status: 'ok' };
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @MessageBody() data: { roomId: string },
        @ConnectedSocket() client: Socket
    ): Promise<{ success: boolean; error?: string }> {
        try {
            if (!data?.roomId) {
                return { success: false, error: 'Room ID is required' };
            }

            const chatRoom = await this.chatService.getChatRoomById(data.roomId);
            if (!chatRoom) {
                return { success: false, error: 'Chat room not found' };
            }
            
            client.join(data.roomId);
            
            const chatHistory = await this.chatService.getChatHistory(data.roomId);
            client.emit('chat_history', chatHistory);
            
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logger.error(`Error joining room: ${errorMessage}`);
            return { success: false, error: 'Failed to join room' };
        }
    }

    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() recipientId: string,
        @ConnectedSocket() client: Socket
    ) {
        const recipientConnection = this.userSocketMap.get(recipientId);
        if (recipientConnection) {
            const sender = this.getUserBySocketId(client.id);
            if (!sender) return;

            this.server.to(recipientConnection.socketId).emit('typing', {
                userId: sender.userId
            });
        }
    }

    @SubscribeMessage('stop_typing')
    handleStopTyping(
        @MessageBody() recipientId: string,
        @ConnectedSocket() client: Socket
    ) {
        const recipientConnection = this.userSocketMap.get(recipientId);
        if (recipientConnection) {
            const sender = this.getUserBySocketId(client.id);
            if (!sender) return;

            this.server.to(recipientConnection.socketId).emit('stop_typing', {
                userId: sender.userId
            });
        }
    }

    @SubscribeMessage('find_chat_room')
    async handleFindChatRoom(
        @MessageBody() data: { participants: string[] },
        @ConnectedSocket() client: Socket
    ): Promise<{ roomId: string | null; error?: string }> {
        try {
            if (!data?.participants || data.participants.length !== 2) {
                return { roomId: null, error: 'Invalid participants data' };
            }

            // Try to find existing room
            let chatRoom = await this.chatService.findExistingChatRoom(data.participants);
            
            if (!chatRoom) {
                // Create new room if none exists
                chatRoom = await this.chatService.createChatRoom(data.participants);
            }

            if (!chatRoom?._id) {
                throw new Error('Failed to get or create chat room');
            }

            return { roomId: chatRoom._id.toString() };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logger.error(`Error finding chat room: ${errorMessage}`);
            return { roomId: null, error: 'Failed to find or create chat room' };
        }
    }

    private getUserBySocketId(socketId: string): UserConnection | undefined {
        for (const [_, connection] of this.userSocketMap.entries()) {
            if (connection.socketId === socketId) return connection;
        }
        return undefined;
    }

    private getUserIdFromSocket(client: Socket): string | undefined {
        const connection = this.getUserBySocketId(client.id);
        return connection?.userId;
    }

    private broadcastOnlineUsers() {
        const onlineUsers = Array.from(this.userSocketMap.values());
        this.server.emit('online_users', onlineUsers);
    }
}
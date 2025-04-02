import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat-gateway';
import { ChatMessage, ChatMessageSchema, ChatRoom, ChatRoomSchema } from './schemas/chat.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ChatMessage.name, schema: ChatMessageSchema },
            { name: ChatRoom.name, schema: ChatRoomSchema },
        ]),
    ],
    providers: [ChatService, ChatGateway],
    exports: [ChatService],
})
export class ChatModule {}

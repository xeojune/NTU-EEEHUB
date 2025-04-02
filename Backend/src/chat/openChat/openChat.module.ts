import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenChatController } from './openChat.controller';
import { OpenChatService } from './openChat.service';
import { OpenChatGateway } from './openChat-gateway';
import { OpenChat, OpenChatSchema } from './schemas/openChat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OpenChat.name, schema: OpenChatSchema },
    ]),
  ],
  controllers: [OpenChatController],
  providers: [OpenChatService, OpenChatGateway],
  exports: [OpenChatService],
})
export class OpenChatModule {}
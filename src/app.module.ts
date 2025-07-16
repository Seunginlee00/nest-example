import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { MqttService } from './mqtt/mqtt.service';
import { NoticeController } from './notice/notice.controller';
import { NoticeService } from './notice/notice.service';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { UserService } from './user/user.service';
import { ChatController } from './chat/chat.controller';

//@SpringBootApplication

@Module({
  controllers: [
    NoticeController,
    ChatController,
    AppController,
    UserController,
  ],
  providers: [
    NoticeService,
    ChatService,
    PrismaService,
    MqttService,
    ChatService,
    ChatGateway,
    UserService,
  ],
})
export class AppModule {}

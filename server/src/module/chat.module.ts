import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from '../web/rest/chat.controller';
import { ChatRepository } from '../repository/chat.repository';
import { ChatService } from '../service/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRepository])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}

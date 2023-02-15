import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationController } from '../web/rest/conversation.controller';
import { ConversationRepository } from '../repository/conversation.repository';
import { ConversationService } from '../service/conversation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationRepository])],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService]
})
export class ConversationModule {}

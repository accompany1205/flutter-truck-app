import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Conversation from '../domain/conversation.entity';
import { ConversationRepository } from '../repository/conversation.repository';

@Injectable()
export class ConversationService {
  logger = new Logger('ConversationService');

  constructor(@InjectRepository(ConversationRepository) private conversationRepository: ConversationRepository) {}

  async findById(id: string): Promise<Conversation | undefined> {
    return await this.conversationRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<Conversation>): Promise<Conversation | undefined> {
    return await this.conversationRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Conversation>): Promise<[Conversation[], number]> {
    return await this.conversationRepository.findAndCount(options);
  }

  async save(conversation: Conversation): Promise<Conversation | undefined> {
    return await this.conversationRepository.save(conversation);
  }

  async update(conversation: Conversation): Promise<Conversation | undefined> {
    return await this.save(conversation);
  }

  async delete(conversation: Conversation): Promise<Conversation | undefined> {
    return await this.conversationRepository.softRemove(conversation);
  }
}

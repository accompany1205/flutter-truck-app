import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Chat from '../domain/chat.entity';
import { ChatRepository } from '../repository/chat.repository';

@Injectable()
export class ChatService {
  logger = new Logger('ChatService');

  constructor(@InjectRepository(ChatRepository) private chatRepository: ChatRepository) {}

  async findById(id: string): Promise<Chat | undefined> {
    return await this.chatRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<Chat>): Promise<Chat | undefined> {
    return await this.chatRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Chat>): Promise<[Chat[], number]> {
    return await this.chatRepository.findAndCount(options);
  }

  async save(chat: Chat): Promise<Chat | undefined> {
    return await this.chatRepository.save(chat);
  }

  async update(chat: Chat): Promise<Chat | undefined> {
    return await this.save(chat);
  }

  async delete(chat: Chat): Promise<Chat | undefined> {
    return await this.chatRepository.softRemove(chat);
  }
}

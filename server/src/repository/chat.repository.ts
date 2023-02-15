import { EntityRepository, Repository } from 'typeorm';
import Chat from '../domain/chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {}

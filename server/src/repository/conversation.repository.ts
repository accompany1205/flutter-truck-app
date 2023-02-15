import { EntityRepository, Repository } from 'typeorm';
import Conversation from '../domain/conversation.entity';

@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {}

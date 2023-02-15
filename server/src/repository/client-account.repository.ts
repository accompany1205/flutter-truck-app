import { EntityRepository, Repository } from 'typeorm';
import ClientAccount from '../domain/client-account.entity';

@EntityRepository(ClientAccount)
export class ClientAccountRepository extends Repository<ClientAccount> {}

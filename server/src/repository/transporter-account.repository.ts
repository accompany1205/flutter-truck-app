import { EntityRepository, Repository } from 'typeorm';
import TransporterAccount from '../domain/transporter-account.entity';

@EntityRepository(TransporterAccount)
export class TransporterAccountRepository extends Repository<TransporterAccount> {}

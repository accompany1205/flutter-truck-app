import { EntityRepository, Repository } from 'typeorm';
import Identity from '../domain/identity.entity';

@EntityRepository(Identity)
export class IdentityRepository extends Repository<Identity> {}

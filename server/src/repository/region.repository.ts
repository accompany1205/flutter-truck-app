import { EntityRepository, Repository } from 'typeorm';
import Region from '../domain/region.entity';

@EntityRepository(Region)
export class RegionRepository extends Repository<Region> {}

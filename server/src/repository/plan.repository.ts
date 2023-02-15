import { EntityRepository, Repository } from 'typeorm';
import Plan from '../domain/plan.entity';

@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {}

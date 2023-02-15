import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Plan from '../domain/plan.entity';
import { PlanRepository } from '../repository/plan.repository';

@Injectable()
export class PlanService {
  logger = new Logger('PlanService');

  constructor(@InjectRepository(PlanRepository) private planRepository: PlanRepository) {}

  async findById(id: string): Promise<Plan | undefined> {
    return await this.planRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<Plan>): Promise<Plan | undefined> {
    return await this.planRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Plan>): Promise<[Plan[], number]> {
    return await this.planRepository.findAndCount(options);
  }

  async save(plan: Plan): Promise<Plan | undefined> {
    return await this.planRepository.save(plan);
  }

  async update(plan: Plan): Promise<Plan | undefined> {
    return await this.save(plan);
  }

  async delete(plan: Plan): Promise<Plan | undefined> {
    return await this.planRepository.softRemove(plan);
  }
}

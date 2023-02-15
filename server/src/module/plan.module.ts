import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from '../web/rest/plan.controller';
import { PlanRepository } from '../repository/plan.repository';
import { PlanService } from '../service/plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanRepository])],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService]
})
export class PlanModule {}

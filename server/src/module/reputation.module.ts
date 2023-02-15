import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReputationController } from '../web/rest/reputation.controller';
import { ReputationRepository } from '../repository/reputation.repository';
import { ReputationService } from '../service/reputation.service';
import { MatchModule } from './match.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReputationRepository]),
    MatchModule
  ],
  controllers: [ReputationController],
  providers: [ReputationService],
  exports: [ReputationService]
})
export class ReputationModule {}

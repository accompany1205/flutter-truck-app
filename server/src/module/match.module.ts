import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from '../web/rest/match.controller';
import { MatchRepository } from '../repository/match.repository';
import { MatchService } from '../service/match.service';
import { TripModule } from './trip.module';
import { TruckModule } from './truck.module';
import { TripRepository } from '../repository/trip.repository';
import { TripService } from '../service/trip.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchRepository]),
    TripModule,
    TruckModule
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
  
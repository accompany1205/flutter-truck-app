import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripController } from '../web/rest/trip.controller';
import { TripRepository } from '../repository/trip.repository';
import { TripService } from '../service/trip.service';
import { LocationRepository } from '../repository/location.repository';
import { ClientAccountRepository } from '../repository/client-account.repository';
import { ClientAccountService } from '../service/client-account.service';
import { LocationModule } from './location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripRepository]),
    TypeOrmModule.forFeature([ClientAccountRepository]),
    HttpModule,
    LocationModule
  ],
  controllers: [TripController],
  providers: [TripService, ClientAccountService],
  exports: [TripService, ClientAccountService]
})
export class TripModule {}

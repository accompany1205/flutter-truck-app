import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from '../web/rest/driver.controller';
import { DriverRepository } from '../repository/driver.repository';
import { DriverService } from '../service/driver.service';

@Module({
  imports: [TypeOrmModule.forFeature([DriverRepository])],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService]
})
export class DriverModule {}

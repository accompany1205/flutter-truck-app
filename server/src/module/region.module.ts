import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionController } from '../web/rest/region.controller';
import { RegionRepository } from '../repository/region.repository';
import { RegionService } from '../service/region.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegionRepository])],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService]
})
export class RegionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityController } from '../web/rest/identity.controller';
import { IdentityRepository } from '../repository/identity.repository';
import { IdentityService } from '../service/identity.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdentityRepository])],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService]
})
export class IdentityModule {}

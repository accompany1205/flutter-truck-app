import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAccountController } from '../web/rest/client-account.controller';
import { ClientAccountRepository } from '../repository/client-account.repository';
import { ClientAccountService } from '../service/client-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientAccountRepository])],
  controllers: [ClientAccountController],
  providers: [ClientAccountService],
  exports: [ClientAccountService]
})
export class ClientAccountModule {}

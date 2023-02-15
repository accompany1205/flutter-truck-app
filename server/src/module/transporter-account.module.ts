import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransporterAccountController } from '../web/rest/transporter-account.controller';
import { TransporterAccountRepository } from '../repository/transporter-account.repository';
import { TransporterAccountService } from '../service/transporter-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransporterAccountRepository])],
  controllers: [TransporterAccountController],
  providers: [TransporterAccountService],
  exports: [TransporterAccountService]
})
export class TransporterAccountModule {}

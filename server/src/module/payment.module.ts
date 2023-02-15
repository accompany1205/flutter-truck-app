import { Module } from '@nestjs/common';
import { PayementController } from '../web/rest/payment.controller';
import { PaymentService } from '../service/payment.service';
import { StripeModule } from 'nestjs-stripe';
import { config } from '../config';
import { PlanModule } from './plan.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    StripeModule.forRoot({
        apiKey: config['stripeApi.secretKey'],
        apiVersion: null
      }),
      UserModule,
      PlanModule
  ],
  controllers: [PayementController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
import { Module } from '@nestjs/common';
import { UserController } from '../web/rest/user.controller';
import { ManagementController } from '../web/rest/management.controller';
import { UserRepository } from '../repository/user.repository';
import { ClientAccountRepository } from '../repository/client-account.repository';
import { TransporterAccountRepository } from '../repository/transporter-account.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config';
import { UserSocialMediaController } from '../web/rest/user.social.media.controller';
import { StripeModule } from 'nestjs-stripe';
import { EmailVerificationEntity } from '../domain/email-verification.entity';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: config['stripeApi.secretKey'],
      apiVersion: null
    }),
    TypeOrmModule.forFeature([UserRepository]), 
    TypeOrmModule.forFeature([ClientAccountRepository]), 
    TypeOrmModule.forFeature([TransporterAccountRepository]),
    TypeOrmModule.forFeature([EmailVerificationEntity]),
    JwtModule.register({
      secret: config['jhipster.security.authentication.jwt.base64-secret'],
      signOptions: { expiresIn: '300s' }
    })
  ],
  controllers: [UserController, ManagementController, UserSocialMediaController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

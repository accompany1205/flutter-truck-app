import { LacusAccountController } from '../web/rest/lacus.account.controller';
import { Module } from '@nestjs/common';
import { AuthService } from '../../service/auth.service';
import { UserModule } from '../../module/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../security/passport.jwt.strategy';
import { config } from '../../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityRepository } from '../../repository/authority.repository';
import { AccountController } from '../../web/rest/account.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ClientAccountRepository } from '../../repository/client-account.repository';
import { ClientAccountService } from '../../service/client-account.service';
import { TransporterAccountRepository } from '../../repository/transporter-account.repository';
import { TransporterAccountService } from '../../service/transporter-account.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
      fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024
      }
    }),
    TypeOrmModule.forFeature([AuthorityRepository, ClientAccountRepository, TransporterAccountRepository]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config['jhipster.security.authentication.jwt.base64-secret'],
      signOptions: { expiresIn: '300s' }
    })
  ],
  controllers: [LacusAccountController, AccountController],
  providers: [AuthService, ClientAccountService, TransporterAccountService, JwtStrategy],
  exports: [AuthService, ClientAccountService, TransporterAccountService]
})
export class LacusRegistrationModule { }

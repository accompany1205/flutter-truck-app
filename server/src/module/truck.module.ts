import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TruckController } from '../web/rest/truck.controller';
import { TruckRepository } from '../repository/truck.repository';
import { TruckService } from '../service/truck.service';
import { TransporterAccountService } from '../service/transporter-account.service';
import { MulterModule } from '@nestjs/platform-express';
import { TransporterAccountRepository } from '../repository/transporter-account.repository';

@Module({
  imports: [
    MulterModule.register({
      dest: './trucks',
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
    TypeOrmModule.forFeature([TruckRepository]),
    TypeOrmModule.forFeature([TransporterAccountRepository])
  ],
  controllers: [TruckController],
  providers: [TruckService, TransporterAccountService],
  exports: [TruckService, TransporterAccountService]
})
export class TruckModule {}

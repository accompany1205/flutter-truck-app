import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Truck from '../domain/truck.entity';
import { TruckRepository } from '../repository/truck.repository';
import { User } from '../domain/user.entity';
import * as fs from 'fs';
import { TransporterAccountService } from './transporter-account.service';
import TransporterAccount from 'src/domain/transporter-account.entity';


@Injectable()
export class TruckService {
  logger = new Logger('TruckService');

  constructor(@InjectRepository(TruckRepository) private truckRepository: TruckRepository,
   private transporterAccountService: TransporterAccountService) {}

  async findById(id: string): Promise<Truck | undefined> {
    return await this.truckRepository.findOne(id, {relations: ['transporterAccount']});
  }

  async findByOwnerId(id: string): Promise<Truck | undefined> {
    return await this.findByfields({ where: { createdBy: id } });
  }

  async userHasRightToAccess(userId: string, id: string): Promise<boolean> {
    let result: Truck = await this.truckRepository.findOne(id);

    if (!result) {
      return false;
    }
    return result.createdBy === userId;
  }

  async findByfields(options: FindOneOptions<Truck>): Promise<Truck | undefined> {
    return await this.truckRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Truck>): Promise<[Truck[], number]> {
    return await this.truckRepository.findAndCount(options);
  }

  async getTransporter(user: User): Promise<TransporterAccount | undefined> {
    return await this.transporterAccountService.findByfields({ where: { user } });
  }

  async save(truck: Truck, file: any, user: User): Promise<Truck | undefined> {
    
    if (file && file.truckImage) {
      // rename the file
      const truckPath = './trucks/avatar_client_' + user.email + '_' + file.truckImage[0].filename;
      fs.renameSync('./' + file.truckImage[0].path, truckPath);
      truck.imgUrl = truckPath;
    }

    truck.transporterAccount = await this.transporterAccountService.findByfields({ where: { user } });

    return await this.truckRepository.save(truck);
  }

  async update(truck: Truck, file: any, user: User): Promise<Truck | undefined> {
    return await this.save(truck, file, user);
  }

  async delete(truck: Truck): Promise<Truck | undefined> {
    return await this.truckRepository.softRemove(truck);
  }

}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TransporterAccount from '../domain/transporter-account.entity';
import { TransporterAccountRepository } from '../repository/transporter-account.repository';

@Injectable()
export class TransporterAccountService {
  logger = new Logger('TransporterAccountService');

  constructor(@InjectRepository(TransporterAccountRepository) private transporterAccountRepository: TransporterAccountRepository) {}

  async findById(id: string): Promise<TransporterAccount | undefined> {
    
    return await this.transporterAccountRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<TransporterAccount>): Promise<TransporterAccount | undefined> {
    options.relations = ['user'];
    return await this.transporterAccountRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TransporterAccount>): Promise<[TransporterAccount[], number]> {
    options.relations = ['user', 'trucks'];
    return await this.transporterAccountRepository.findAndCount(options);
  }

  async save(transporterAccount: TransporterAccount): Promise<TransporterAccount | undefined> {
    return await this.transporterAccountRepository.save(transporterAccount);
  }

  async update(transporterAccount: TransporterAccount): Promise<TransporterAccount | undefined> {
    return await this.save(transporterAccount);
  }

  async delete(transporterAccount: TransporterAccount): Promise<TransporterAccount | undefined> {
    return await this.transporterAccountRepository.softRemove(transporterAccount);
  }
}

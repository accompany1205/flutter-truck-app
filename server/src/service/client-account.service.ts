import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import ClientAccount from '../domain/client-account.entity';
import { ClientAccountRepository } from '../repository/client-account.repository';

@Injectable()
export class ClientAccountService {
  logger = new Logger('ClientAccountService');

  constructor(@InjectRepository(ClientAccountRepository) private clientAccountRepository: ClientAccountRepository) {}

  async findById(id: string): Promise<ClientAccount | undefined> {
    return await this.clientAccountRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<ClientAccount>): Promise<ClientAccount | undefined> {
    return await this.clientAccountRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<ClientAccount>): Promise<[ClientAccount[], number]> {
    return await this.clientAccountRepository.findAndCount(options);
  }

  async save(clientAccount: ClientAccount): Promise<ClientAccount | undefined> {
    return await this.clientAccountRepository.save(clientAccount);
  }

  async update(clientAccount: ClientAccount): Promise<ClientAccount | undefined> {
    return await this.save(clientAccount);
  }

  async delete(clientAccount: ClientAccount): Promise<ClientAccount | undefined> {
    return await this.clientAccountRepository.softRemove(clientAccount);
  }
}

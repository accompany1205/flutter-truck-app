import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Identity from '../domain/identity.entity';
import { IdentityRepository } from '../repository/identity.repository';

@Injectable()
export class IdentityService {
  logger = new Logger('IdentityService');

  constructor(@InjectRepository(IdentityRepository) private identityRepository: IdentityRepository) {}

  async findById(id: string): Promise<Identity | undefined> {
    return await this.identityRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<Identity>): Promise<Identity | undefined> {
    return await this.identityRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Identity>): Promise<[Identity[], number]> {
    return await this.identityRepository.findAndCount(options);
  }

  async save(identity: Identity): Promise<Identity | undefined> {
    return await this.identityRepository.save(identity);
  }

  async update(identity: Identity): Promise<Identity | undefined> {
    return await this.save(identity);
  }

  async delete(identity: Identity): Promise<Identity | undefined> {
    return await this.identityRepository.softRemove(identity);
  }

  public async fetchIdentity(id: string) {
    // Fetch Identity of User !
    // return Path !
    const user = await this.identityRepository.findOne(id);
    if (user.imageUrl !== null) {
      return null;
    } else {
      return null;
    }
  }
}

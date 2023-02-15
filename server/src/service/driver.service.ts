import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Driver from '../domain/driver.entity';
import { DriverRepository } from '../repository/driver.repository';

@Injectable()
export class DriverService {
  logger = new Logger('DriverService');

  constructor(@InjectRepository(DriverRepository) private driverRepository: DriverRepository) {}

  async findById(id: string): Promise<Driver | undefined> {
    return await this.driverRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<Driver>): Promise<Driver | undefined> {
    return await this.driverRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Driver>): Promise<[Driver[], number]> {
    return await this.driverRepository.findAndCount(options);
  }

  async save(driver: Driver): Promise<Driver | undefined> {
    return await this.driverRepository.save(driver);
  }

  async update(driver: Driver): Promise<Driver | undefined> {
    return await this.save(driver);
  }

  async delete(driver: Driver): Promise<Driver | undefined> {
    return await this.driverRepository.softRemove(driver);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Location from '../domain/location.entity';
import { LocationRepository } from '../repository/location.repository';

@Injectable()
export class LocationService {
  logger = new Logger('LocationService');

  constructor(@InjectRepository(LocationRepository) private locationRepository: LocationRepository) {}

  async findById(id: string): Promise<Location | undefined> {
    return await this.locationRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<Location>): Promise<Location | undefined> {
    return await this.locationRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Location>): Promise<[Location[], number]> {
    return await this.locationRepository.findAndCount(options);
  }

  async save(location: Location): Promise<Location | undefined> {
    return await this.locationRepository.save(location);
  }

  async update(location: Location): Promise<Location | undefined> {
    return await this.save(location);
  }

  async delete(location: Location): Promise<Location | undefined> {
    return await this.locationRepository.softRemove(location);
  }
}

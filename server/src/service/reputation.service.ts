import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Match from 'src/domain/match.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Reputation from '../domain/reputation.entity';
import { ReputationRepository } from '../repository/reputation.repository';
import { MatchService } from './match.service';
import { config } from '../config';

@Injectable()
export class ReputationService {
  logger = new Logger('ReputationService');

  constructor(
    @InjectRepository(ReputationRepository) private reputationRepository: ReputationRepository,
    private readonly matchService: MatchService
  ) { }

  async findById(id: string): Promise<Reputation | undefined> {
    return await this.reputationRepository.findOne(id);
  }

  async findByfields(options: FindOneOptions<Reputation>): Promise<Reputation | undefined> {
    return await this.reputationRepository.findOne(options);
  }

  async findByfieldsMany(options: FindManyOptions<Reputation>): Promise<Reputation[] | undefined> {
    return await this.reputationRepository.find(options);
  }

  async findAndCount(options: FindManyOptions<Reputation>): Promise<[Reputation[], number]> {
    return await this.reputationRepository.findAndCount(options);
  }

  async getAverageRatingForUser(userId: string): Promise<any> {
    return await this.reputationRepository.createQueryBuilder("reputation")
      .select("AVR(reputation.rate)", "average")
      .where("reputation.to === " + userId)
      .getOne();
  }

  async save(reputation: Reputation): Promise<Reputation | undefined> {
    const daysToComment = config.get('lacus.daysToComment');
    const today = new Date();
    const maxDaytoComment = today.setDate(today.getDate() - daysToComment);

    if (!reputation.match || (await this.reputationRepository.findReputationOfMatchForUser(reputation.from.id, reputation.match.id)).length !== 0) {
      throw new HttpException('You are not allowed !', HttpStatus.UNAUTHORIZED);
    }

    // if we are not saving to someone with whome we had the match.
    const match: Match = await this.matchService.findById(reputation.match.id, { relations: ['trip', 'trip.clientAccount', 'truck', 'truck.transporterAccount'] });
    
    if ((match.trip.clientAccount.user.id == reputation.from.id && match.truck.transporterAccount.user.id == reputation.to.id ||
      match.trip.clientAccount.user.id == reputation.to.id && match.truck.transporterAccount.user.id == reputation.from.id) && match.date.getDay() < maxDaytoComment) {
        return await this.reputationRepository.save(reputation);
    } else {
      throw new HttpException('You are not allowed!', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(reputation: Reputation): Promise<Reputation | undefined> {
    return await this.save(reputation);
  }

  async delete(reputation: Reputation): Promise<Reputation | undefined> {
    return await this.reputationRepository.softRemove(reputation);
  }
}

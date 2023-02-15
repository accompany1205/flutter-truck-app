import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Truck from '../domain/truck.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Match from '../domain/match.entity';
import { MatchRepository } from '../repository/match.repository';
import { TruckService } from './truck.service';
import { User } from 'src/domain/user.entity';
import { TripService } from './trip.service';
import Trip from 'src/domain/trip.entity';
import { EMatchState } from '../domain/enumeration/e-match-state';
import { ETripState } from '../domain/enumeration/e-trip-state';

@Injectable()
export class MatchService {
  logger = new Logger('MatchService');

  constructor(
    @InjectRepository(MatchRepository) private matchRepository: MatchRepository,
    @Inject(forwardRef(() => TripService)) private readonly tripService: TripService,
    private truckService: TruckService
    ) {}

  async findById(id: string, options?: FindOneOptions<Match>): Promise<Match | undefined> {
    return await this.matchRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Match>): Promise<Match | undefined> {
    return await this.matchRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Match>): Promise<[Match[], number]> {
    return await this.matchRepository.findAndCount(options);
  }


  async save(match: Match, user: User): Promise<Trip | undefined> {
    // Retrieve truck by id:
    const truck: Truck = await this.truckService.findById(match.truck.id);
    // if truck was created by the user:
    if (truck && truck.transporterAccount.id === user.id){
      // Retrieve trip by id:
      const trip: Trip = await this.tripService.findById(match.trip.id);
      if(trip.matches.filter(e => e.status === EMatchState.ACCEPTED || e.status === EMatchState.PENDING ).length > 0){
        // if the tip has a match that is already accepted
        // Send a message that the trip is already accepted or pending by someone else.
        throw new HttpException('You cannot request a trip that is already accepted or pending', HttpStatus.UNAUTHORIZED);
      } else {
        match.trip = trip;
        match.date = new Date();
        match.status = EMatchState.REQUESTED;
        match.trip.state = ETripState.REQUESTED;
        await this.tripService.updateTrip(match.trip);
        await this.matchRepository.save(match);
        return await this.tripService.findById(trip.id);
      }
    } else {
      throw new HttpException('You cannot request with a truck that is not yours', HttpStatus.UNAUTHORIZED);
      // Means the user tries to assign a truck that is not his ...
      // return unauthorized or bad request.
    }
  }

  async acceptMatch(id: string, userId: string): Promise<Trip | undefined> {
    const match: Match = await this.findById(id, {relations: ['trip', 'trip.clientAccount', 'trip.matches']});
    let trip: Trip = match.trip;
    if(trip.clientAccount.id !== userId){
      this.logger.warn('A user whose id is {} tries to accept a match that he is not his', userId);
      throw new HttpException('The match you send doesnt belong to you' , HttpStatus.UNAUTHORIZED);
    }
    match.status = EMatchState.ACCEPTED;
    trip.state = ETripState.MATCHED;
    trip = await this.changeAllOtherMatchsToRejected(id, trip);
    await this.matchRepository.save(match);
    await this.tripService.updateTrip(trip);
    return await this.tripService.findById(trip.id);
  }


  async rejectMatch(id: string, userId: string): Promise<Trip | undefined> {
    const match: Match = await this.findById(id, {relations: ['trip', 'trip.clientAccount', 'trip.matches']},);
    let trip: Trip = match.trip;
    if(trip.clientAccount.id !== userId){
      this.logger.warn('A user whose id is {} tries to edit a match that he is not his', userId);
      throw new HttpException('The match you send doesnt belong to you' , HttpStatus.UNAUTHORIZED);
    }
    // Need to check if there is no more request to change trip status to empty with no request
    match.status = EMatchState.DECLINED;
    await this.matchRepository.remove(match);
    return await this.tripService.findById(trip.id);
  }


  private async changeAllOtherMatchsToRejected(matchId: string, trip: Trip): Promise<Trip>{
    trip.matches.filter(match => match.id !== matchId)
                .forEach(match => match.status = EMatchState.DECLINED);
    return trip;
  }

  
/*
  async update(match: Match): Promise<Match | undefined> {
    return await this.save(match);
  }
*/
  async delete(matchId: string, user: User): Promise<Trip | undefined> {
    console.log(matchId);
    const match: Match = await this.findById(matchId, {relations: ['trip', 'trip.clientAccount',], });
    console.log(match);
    if(match.createdBy !== user.id){
      this.logger.warn('A user tries to cancel a match that he is not his ', user.login);
      throw new HttpException('The match was not created by you' , HttpStatus.UNAUTHORIZED);
    }
    await this.matchRepository.softRemove(match);
    return await this.tripService.findById(match.trip.id);
  }
}

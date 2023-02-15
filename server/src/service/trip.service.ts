import { Injectable, Logger, HttpService, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, getRepository, JoinOptions } from 'typeorm';
import Trip from '../domain/trip.entity';
import { TripRepository } from '../repository/trip.repository';
import { config } from '../config';
import * as fs from 'fs';
import Location from '../domain/location.entity';
import { exception } from 'console';
import { User } from '../domain/user.entity';
import { ClientAccountService } from './client-account.service';
import { EMarchandise } from '../domain/enumeration/e-marchandise';
import { IGoogle } from '../shared/interface/IGoogle';
import { ETripState } from '../domain/enumeration/e-trip-state';
import { ITripsAverage } from 'src/shared/interface/ITripsAverage';
import { PageRequest } from 'src/domain/base/pagination.entity';


@Injectable()
export class TripService {
  logger = new Logger('TripService');

  constructor(
    @InjectRepository(TripRepository) private tripRepository: TripRepository,
    private clientAccountService: ClientAccountService,
    private httpService: HttpService) { }

  async findById(id: string): Promise<Trip | undefined> {
    return await this.tripRepository.findOne(id, {relations: ['matches', 'matches.truck', 'matches.truck.transporterAccount', 'clientAccount']});
  }

  async findByfields(options: FindOneOptions<Trip>): Promise<Trip | undefined> {
    options.relations = ['matches', 'clientAccount'];
    return await this.tripRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Trip>): Promise<[Trip[], number]> {
    options.relations = ['matches', 'matches.truck', 'matches.truck.transporterAccount', 'clientAccount'];
    return await this.tripRepository.findAndCount(options);
  }

  async find(options: FindManyOptions<Trip>): Promise<Trip[]> {
    options.relations = ['matches', 'matches.truck', 'matches.truck.transporterAccount', 'clientAccount'];
    return await this.tripRepository.find(options);
  }

  async findWithMatches(options: FindOneOptions<Trip>): Promise<Trip | undefined>{
    options.relations = ['matches'];
    return this.tripRepository.findOne(options);
  }

  async updateTrip(trip: Trip): Promise<Trip | undefined>{
    return this.tripRepository.save(trip)
  }

  async findAllTripsWithSpecificStatusForUser(userId: string, pageIndex: number, pageSize: number): Promise<[ITripsAverage[], number]>{
    return await this.tripRepository.selectAllForTransporter(userId, pageIndex, pageSize);
  }

  async findAllTrips(pageIndex: number, pageSize: number): Promise<[ITripsAverage[], number]>{
    return await this.tripRepository.selectAllForForAdmin(pageIndex, pageSize);
  }

  async findAllForClientWithRating(user: User, pageRequest: PageRequest): Promise<any>{

    const trips: Trip[] = await this.find({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      where: {clientAccount: (await this.clientAccountService.findByfields({where: {user}}))},
      order: pageRequest.sort.asOrder()
    });

    let transporters = [];

    trips.forEach(trip => trip.matches.forEach(match => transporters.push(match.truck.transporterAccount)));

    const transporterIds: string[] = [];
    transporters.map(transporter => {
      if(transporterIds.indexOf(transporter.id) === -1){
        transporterIds.push(transporter.id);
      }
    });

    const rawQuery = await this.tripRepository.calculateAverageRating(transporterIds);

    transporters.forEach(transporter => {
      let buffer: any = rawQuery.find(element => element['id'] === transporter.id);
      if(buffer){
        transporter.averageRating = Number(buffer['avg_rating']);
        transporter.totalTrucks = Number(buffer['total_trucks'])
      } else {
        transporter.averageRating = 0;
        transporter.totalTrucks = 1;
      }
    });

    return trips;
  }


  async save(trip: Trip, user: User, isUpdate: boolean): Promise<Trip | undefined> {
    trip = this.normalizeMarchandiseEnum(trip);
    const exists = this.checkIfImgExists(trip.origin, trip.destination);
    if (exists.exists) {
      trip.tripImg = exists.path;
    } else {
      const result = await this.calculateTripImg(trip.origin, trip.destination, '800x400');
      trip.tripImg = result.filePath;
      trip.distance = result.distance.value || null;
    }
    try {
      trip.state = ETripState.WAITING;
      if(!isUpdate){
        trip.clientAccount = {
          id: user.id,
          user
        };
      }
      return await this.tripRepository.save(trip);
    } catch (e) {
      throw new exception(e);
    }
  }

  async update(trip: Trip): Promise<Trip | undefined> {
    // if trip has status pending:
    // Change the data with no problem:
    // if status = SHIPED || matched change is not allowed.
    if (trip.state === ETripState.FINISHED || trip.state === ETripState.MATCHED){
      throw new HttpException('You are not allowed to edit the trip', HttpStatus.UNAUTHORIZED);
    }
    if (trip.state === ETripState.REQUESTED){
      // if status = REQUESTED cancel all requests of match
      /*
      const matchs: Match[] = await (await this.findWithMatches({ where: {trip} })).matches;
       matchs.forEach( async match => {
          await this.matchService.delete(match);
       });
      */
       // Push a notif that says that all Requests are Cancelled !
       trip.matches = [];
    }
    trip = this.normalizeMarchandiseEnum(trip);
    const exists = this.checkIfImgExists(trip.origin, trip.destination);
    if (exists.exists) {
      trip.tripImg = exists.path;
    } else {
      const result = await this.calculateTripImg(trip.origin, trip.destination, '400x400');
      trip.tripImg = result.filePath;
      trip.distance = result.distance.value || null;
    }
    return await this.save(trip, null, true);
  }

  async delete(trip: Trip): Promise<Trip | undefined> {
    return await this.tripRepository.softRemove(trip);
  }

  private async calculateTripImg(origin: Location, destination: Location, imgRatio: string): Promise<IGoogle> {
    const originLatLong = this.getLocation(origin);
    const destinationLatLong = this.getLocation(destination);
    const key = config.get('googleAPI.key');
    const path = this.calculateImagePath(origin, destination);
    const basicImageEndpoint = 'http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=' + imgRatio + '&path=weight:3%7Ccolor:red%7Cenc:';
    const geoCodingUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + originLatLong + '&destination=' + destinationLatLong + '&mode=driving&key=' + key;
    const response = await this.httpService.get(geoCodingUrl).toPromise();
    const polyLine = encodeURI(response.data.routes[0].overview_polyline.points);
    const finalEndpoint = basicImageEndpoint + polyLine + '&key=' + key;
    const result = {
      filePath: path,
      distance: response.data.routes[0].legs[0].distance
    }
    try {
      this.downloadImage(finalEndpoint, path);
      return result;
    } catch (error) {
      return config.get('googleApi.error.image.path');
    }
  }

  public checkIfTransporterInTrip(trips: Trip[], user: User): Trip[] {
    trips.forEach(element => {
      element.matches.map(match => {
        if(match.truck.transporterAccount.id === user.id){
          element.matches = [match];
        } else {
          element.matches = [];
        }
      });
    });

    return trips;
  }

  private checkIfImgExists(origin: Location, destination: Location): any {
    const file = this.calculateImagePath(origin, destination);
    try {
      if (fs.existsSync(file)) {
        return {
          'exists': true,
          'path': file
        };
      } else {
        return {
          'exists': false
        };
      }
    } catch (err) {
      return {
        'exists': false
      };
    }
  }

  private calculateImagePath(origin: Location, destination: Location): string {
    const originLatLong = this.getLocation(origin);
    const destinationLatLong = this.getLocation(destination);
    const imagePath = config.get('googleApi.images.path');
    return  imagePath + origin.city + '_' + originLatLong + '_' + destination.city + '_'+ destinationLatLong +'.png';
  }

  private async downloadImage(endPoint: string, path: string): Promise<any> {
    const Axios = require('axios');
    const url = endPoint;

    const writer = fs.createWriteStream(path)

    const response = await Axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

  private getLocation(location: Location): string {
    if (location.latitude && location.longitude) {
      return location.latitude + ',' + location.longitude;
    } else if (location.city) {
      return location.city;
    } else if (location.stateProvince) {
      return location.stateProvince
    } else if (location.country) {
      return location.country
    }
  }

  public async userHasRightToAccess(userId: string, id: string): Promise<boolean> {
    let result: Trip = await this.tripRepository.findOne(id);
    return true;
    if (!result) {
      return false;
    }
    return result.createdBy === userId;
  }

  private normalizeMarchandiseEnum(trip: Trip): Trip {
    switch(trip.marchandise) {
      case 'VEGETABLES': {
         trip.marchandise = EMarchandise.VEGETABLES;
         break;
      }
      case 'RAW_MATERIAL': {
        trip.marchandise = EMarchandise.RAW_MATERIAL;
        break;
      }
      case 'FISH': {
        trip.marchandise = EMarchandise.FISH;
        break;
      }
      default: {
        trip.marchandise = EMarchandise.OTHER;
        break;
      }
   }
   return trip;
  }

}

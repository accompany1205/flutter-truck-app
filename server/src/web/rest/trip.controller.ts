import { Body, Controller, Delete, Get, Res, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Trip from '../../domain/trip.entity';
import { TripService } from '../../service/trip.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType, AuthUser } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { AuditInterceptor } from '../../client/interceptors/audit.interceptor';
import { User } from '../../domain/user.entity';
import { ITripsAverage } from '../../shared/interface/ITripsAverage';

@Controller('api/trips')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('trips')
export class TripController {
  logger = new Logger('TripController');

  constructor(private readonly tripService: TripService) {}

  //@Roles(RoleType.ADMIN, RoleType.TRANSPORTER)
  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Trip
  })
  async getAll(@AuthUser() user: User, @Req() req: Request): Promise<ITripsAverage[]> {

    this.logger.debug('GET request to get all trips for admin');

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);

    const results = await this.tripService.findAllTrips(pageRequest.page, pageRequest.size)

    console.log(results[0]);

    return results[0];
  }


  @Roles(RoleType.TRANSPORTER)
  @Get('/transporter')
  @ApiResponse({
    status: 200,
    description: 'List all records for transporter',
    type: Trip
  })
  async getAllTransporterTrips(@AuthUser() user: User, @Req() req: Request): Promise<Trip[]> {

    this.logger.debug('GET request to get all trips for a transporter');

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);

    const trips = await this.tripService.find({
      where: [
        {state: 1},
        {state: 3}
      ],
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });

    return this.tripService.checkIfTransporterInTrip(trips, user);
  }

  @Roles(RoleType.TRANSPORTER)
  @Get('/requested')
  @ApiResponse({
    status: 200,
    description: 'List all records that are requested by a transporter',
    type: Trip
  })
  async getAllRequested(@AuthUser() user: User, @Req() req: Request): Promise<ITripsAverage[]> {

    this.logger.debug('GET request to get all trips of a transporter');

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);

    const results = await this.tripService.findAllTripsWithSpecificStatusForUser(user.id, pageRequest.page, pageRequest.size);

    return results[0];
  }

  @Roles(RoleType.CLIENT)
  @Get('/own')
  @ApiResponse({
    status: 200,
    description: 'List all own records',
    type: Trip
  })
  async getOwn(@AuthUser() user: User, @Req() req: Request): Promise<any> {

    this.logger.debug('GET request to get all trips');

    // match transporter rating
    // Need to get the matches that are not rejected
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);

    return await this.tripService.findAllForClientWithRating(user, pageRequest);
  }


  @Get('/byid/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Trip
  })
  async getOne(@Param('id') id: string): Promise<Trip> {

    this.logger.debug('GET request to get trip ' + id);

    return await this.tripService.findById(id);
  }

  @PostMethod('/')
  @ApiOperation({ title: 'Create trip' })
  @UseInterceptors(AuditInterceptor)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Trip
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@AuthUser() user: User, @Req() req: Request, @Body() trip: Trip): Promise<Trip> {

    this.logger.debug('Post request to create new trip by ' + user.login);

    const created = await this.tripService.save(trip, user, false);

    HeaderUtil.addEntityCreatedHeaders(req.res, 'Trip', created.id);

    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update trip' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Trip
  })
  async put(@AuthUser() user: User, @Req() req: Request, @Body() trip: Trip): Promise<Trip> {

    this.logger.debug('PUT request to update trip ' + trip.id + ' by ' + user.login);

    if (!await this.tripService.userHasRightToAccess(user.id, trip.id)) {
      throw new HttpException('User not Authorized to access this entity', HttpStatus.UNAUTHORIZED);
    }

    HeaderUtil.addEntityCreatedHeaders(req.res, 'Trip', trip.id);

    return await this.tripService.update(trip);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete trip' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@AuthUser() user: User, @Req() req: Request, @Param('id') id: string): Promise<Trip> {

    this.logger.debug('DELETE request to trip ' + id + ' by ' + user.login);

    if (!await this.tripService.userHasRightToAccess(user.id, id)) {
      throw new HttpException('User not Authorized to access this entity', HttpStatus.UNAUTHORIZED);
    }

    HeaderUtil.addEntityDeletedHeaders(req.res, 'Trip', id);

    const toDelete = await this.tripService.findById(id);

    return await this.tripService.delete(toDelete);
  }

  @Get('img/:imgPath')
  async getAvatar(@Param('imgPath') image: string, @Res() res: Response): Promise<void> {

    this.logger.debug('get image for avatar ' + image);

    return res.sendFile(image, { root: 'google'});
  }
}

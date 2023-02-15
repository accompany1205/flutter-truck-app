import { Body, Controller, Delete, Get, Res, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, HttpException, HttpStatus, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Truck from '../../domain/truck.entity';
import { TruckService } from '../../service/truck.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType, AuthUser } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { AuditInterceptor } from '../../client/interceptors/audit.interceptor';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ETruckType } from '../../domain/enumeration/e-truck-type';

@Controller('api/trucks')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('trucks')
export class TruckController {
  logger = new Logger('TruckController');

  constructor(private readonly truckService: TruckService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Truck
  })
  async getAll(@AuthUser() user: User, @Req() req: Request): Promise<Truck[]> {

    this.logger.debug('Get All trucks by ' + user.login);

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.truckService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/own')
  @Roles(RoleType.TRANSPORTER)
  @ApiResponse({
    status: 200,
    description: 'List all own records',
    type: Truck
  })
  async getOwn(@AuthUser() user: User, @Req() req: Request): Promise<Truck[]> {

    this.logger.debug('Get own trucks by ' + user.login);

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.truckService.findAndCount({
      where: {transporterAccount: await this.truckService.getTransporter(user)},
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/available/:id')
  @Roles(RoleType.TRANSPORTER)
  @ApiResponse({
    status: 200,
    description: 'List all own records',
    type: Truck
  })
  async getAvailable(@AuthUser() user: User, @Req() req: Request, @Param('id') idTrip: string): Promise<Truck[]> {

    this.logger.debug('Get own trucks by ' + user.login);

    // TODO: Need to check the available trucks with the trip selected

    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.truckService.findAndCount({
      where: {transporterAccount: await this.truckService.getTransporter(user)},
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/byid/:id')
  @Roles(RoleType.TRANSPORTER)
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Truck
  })
  async getOne(@AuthUser() user: User, @Param('id') id: string): Promise<Truck> {

    this.logger.debug('Get request truck by ' + user.login);

    if (!await this.truckService.userHasRightToAccess(user.id, id)) {
      throw new HttpException('User not Authorized to access this entity', HttpStatus.UNAUTHORIZED);
    }
    return await this.truckService.findById(id);
  }

  @PostMethod('/')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'truckImage', maxCount: 1 }
    ]),
    AuditInterceptor
  )
  @Roles(RoleType.TRANSPORTER)
  @UseGuards(AuthGuard)
  @ApiOperation({ title: 'Create truck' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Truck
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@AuthUser() user: User, @Req() req: Request, @UploadedFiles() files, @Body() truck: Truck): Promise<Truck> {

    this.logger.debug('Post request to create new truck by ' + user.login);

    truck.type = truck.type.toString() == '0' ? ETruckType.DOMESTIC : ETruckType.EXPORT;

    const created = await this.truckService.save(truck, files, user);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Truck', created.id);
    return created;
  }

  @Put('/')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'truckImage', maxCount: 1 }
    ])
  )
  @Roles(RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Update truck' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Truck
  })
  async put(@AuthUser() user: User, @Req() req: Request, @UploadedFiles() files, @Body() truck: Truck): Promise<Truck> {

    this.logger.debug('PUT request to update truck ' + truck.id + ' by ' + user.login);

    if (!await this.truckService.userHasRightToAccess(user.id, truck.id)) {
      throw new HttpException('User not Authorized to access this entity', HttpStatus.UNAUTHORIZED);
    }

    HeaderUtil.addEntityCreatedHeaders(req.res, 'Truck', truck.id);
    return await this.truckService.update(truck, files, user);
  }

  @Delete('/:id')
  @Roles(RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Delete truck' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@AuthUser() user: User, @Req() req: Request, @Param('id') id: string): Promise<Truck> {

    this.logger.debug('DELETE request to truck ' + id + ' by ' + user.login);

    if (!await this.truckService.userHasRightToAccess(user.id, id)) {
      throw new HttpException('User not Authorized to access this entity', HttpStatus.UNAUTHORIZED);
    }

    HeaderUtil.addEntityDeletedHeaders(req.res, 'Truck', id);
    const toDelete = await this.truckService.findById(id);
    return await this.truckService.delete(toDelete);
  }

  @Get('img/:imgPath')
  async getTruckImg(@Param('imgPath') image: string, @Res() res: Response): Promise<void> {

    this.logger.debug('get image for truck ' + image);

    return res.sendFile(image, { root: 'trucks'});
  }
}

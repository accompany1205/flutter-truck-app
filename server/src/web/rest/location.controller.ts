import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Location from '../../domain/location.entity';
import { LocationService } from '../../service/location.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/locations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('locations')
export class LocationController {
  logger = new Logger('LocationController');

  constructor(private readonly locationService: LocationService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Location
  })
  async getAll(@Req() req: Request): Promise<Location[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.locationService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Location
  })
  async getOne(@Param('id') id: string): Promise<Location> {
    return await this.locationService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create location' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Location
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() location: Location): Promise<Location> {
    const created = await this.locationService.save(location);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update location' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Location
  })
  async put(@Req() req: Request, @Body() location: Location): Promise<Location> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', location.id);
    return await this.locationService.update(location);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete location' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Location> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Location', id);
    const toDelete = await this.locationService.findById(id);
    return await this.locationService.delete(toDelete);
  }
}

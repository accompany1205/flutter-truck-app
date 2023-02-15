import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Driver from '../../domain/driver.entity';
import { DriverService } from '../../service/driver.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/drivers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('drivers')
export class DriverController {
  logger = new Logger('DriverController');

  constructor(private readonly driverService: DriverService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Driver
  })
  async getAll(@Req() req: Request): Promise<Driver[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.driverService.findAndCount({
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
    type: Driver
  })
  async getOne(@Param('id') id: string): Promise<Driver> {
    return await this.driverService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create driver' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Driver
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() driver: Driver): Promise<Driver> {
    const created = await this.driverService.save(driver);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Driver', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update driver' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Driver
  })
  async put(@Req() req: Request, @Body() driver: Driver): Promise<Driver> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Driver', driver.id);
    return await this.driverService.update(driver);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete driver' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Driver> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Driver', id);
    const toDelete = await this.driverService.findById(id);
    return await this.driverService.delete(toDelete);
  }
}

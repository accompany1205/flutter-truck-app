import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Region from '../../domain/region.entity';
import { RegionService } from '../../service/region.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/regions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('regions')
export class RegionController {
  logger = new Logger('RegionController');

  constructor(private readonly regionService: RegionService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Region
  })
  async getAll(@Req() req: Request): Promise<Region[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.regionService.findAndCount({
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
    type: Region
  })
  async getOne(@Param('id') id: string): Promise<Region> {
    return await this.regionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create region' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Region
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() region: Region): Promise<Region> {
    const created = await this.regionService.save(region);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Region', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update region' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Region
  })
  async put(@Req() req: Request, @Body() region: Region): Promise<Region> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Region', region.id);
    return await this.regionService.update(region);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete region' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Region> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Region', id);
    const toDelete = await this.regionService.findById(id);
    return await this.regionService.delete(toDelete);
  }
}

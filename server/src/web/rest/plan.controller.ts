import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import plan from '../../domain/plan.entity';
import { PlanService } from '../../service/plan.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/plans')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('plans')
export class PlanController {
  logger = new Logger('planController');

  constructor(private readonly planService: PlanService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: plan
  })
  async getAll(@Req() req: Request): Promise<plan[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.planService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: plan
  })
  async getOne(@Param('id') id: string): Promise<plan> {
    return await this.planService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Create plan' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: plan
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() plan: plan): Promise<plan> {
    const created = await this.planService.save(plan);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'plan', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update plan' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: plan
  })
  async put(@Req() req: Request, @Body() plan: plan): Promise<plan> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'plan', plan.id);
    return await this.planService.update(plan);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Delete plan' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<plan> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'plan', id);
    const toDelete = await this.planService.findById(id);
    return await this.planService.delete(toDelete);
  }
}

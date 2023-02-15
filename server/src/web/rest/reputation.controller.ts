import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Reputation from '../../domain/reputation.entity';
import { ReputationService } from '../../service/reputation.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, AuthUser, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { Equal } from 'typeorm';

@Controller('api/reputations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('reputations')
export class ReputationController {
  logger = new Logger('ReputationController');

  constructor(private readonly reputationService: ReputationService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Reputation
  })
  async getAll(@Req() req: any): Promise<Reputation[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.reputationService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/user/:id')
  @Roles(RoleType.CLIENT, RoleType.TRANSPORTER, RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Reputation
  })
  async getOne(@Req() req: any, @Param('id') id: string): Promise<Reputation[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.reputationService.findAndCount({
      where: req.query.reputation ? { to: {id}, rate: Equal(req.query.reputation)} : {to: {id}},
      relations: ['from'],
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/test')
  @ApiResponse({
    status: 200,
    description: 'The found record'
  })
  async getTestOne(@AuthUser() user: User): Promise<any> {
    return await this.reputationService.getAverageRatingForUser(user.id);
  }

  @Get('/comment')
  @Roles(RoleType.CLIENT, RoleType.TRANSPORTER)
  @ApiResponse({
    status: 200,
    description: 'The found record'
  })
  async getIfCanComment(@AuthUser() user: User, @Req() req: Request,): Promise<Boolean> {

    const id_user: string = req.query.id_user as string;
    const id_match: string = req.query.id_match as string;

    const reputation = await this.reputationService.findByfields({
      where: {
        from: {id: user.id},
        to: {id: id_user},
        match: {id: id_match}
      }
    });
    return reputation == null;
  }

  @PostMethod('/')
  // Todo: check at least 10 characters minimum for the comment
  @Roles(RoleType.CLIENT, RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Create reputation' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Reputation
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@AuthUser() user: User, @Req() req: Request, @Body() reputation: Reputation): Promise<Reputation> {
    reputation.from = user;
    const created = await this.reputationService.save(reputation);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reputation', created.id);
    return created;
  }
/*
  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update reputation' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Reputation
  })
  async put(@Req() req: Request, @Body() reputation: Reputation): Promise<Reputation> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Reputation', reputation.id);
    return await this.reputationService.update(reputation);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete reputation' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Reputation> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Reputation', id);
    const toDelete = await this.reputationService.findById(id);
    return await this.reputationService.delete(toDelete);
  }
  */
}

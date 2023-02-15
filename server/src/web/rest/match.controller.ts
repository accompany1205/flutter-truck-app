import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Match from '../../domain/match.entity';
import { MatchService } from '../../service/match.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType, AuthUser } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import Trip from '../../domain/trip.entity';

@Controller('api/matches')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('matches')
export class MatchController {
  logger = new Logger('MatchController');

  constructor(private readonly matchService: MatchService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Match
  })
  async getAll(@Req() req: Request): Promise<Match[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.matchService.findAndCount({
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
    type: Match
  })
  async getOne(@Param('id') id: string): Promise<Match> {
    return await this.matchService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Create match' })
  @UseInterceptors(LoggingInterceptor)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Match
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@AuthUser() user: User, @Req() req: Request, @Body() match: Match): Promise<Trip> {

    this.logger.debug('Post request to create new match by ' + user.login);

    const created = await this.matchService.save(match, user);

    HeaderUtil.addEntityCreatedHeaders(req.res, 'Match', created.id);

    return created;
  }

  @PostMethod('accept/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Accept match' })
  @UseInterceptors(LoggingInterceptor)
  @ApiResponse({
    status: 201,
    description: 'Accept the match request',
    type: Match
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async clientAcceptsMatch(@AuthUser() user: User, @Req() req: Request, @Param('id') id: string): Promise<Trip> {

    this.logger.debug('Post request to accept a match by ' + user.login);

    const created: Trip = await this.matchService.acceptMatch(id, user.id);

    HeaderUtil.addEntityCreatedHeaders(req.res, 'Match', created.id);

    return created;
  }


  @PostMethod('reject/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Reject match' })
  @UseInterceptors(LoggingInterceptor)
  @ApiResponse({
    status: 201,
    description: 'Reject the match request',
    type: Match
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async clientRejectsMatch(@AuthUser() user: User, @Req() req: Request, @Param('id') id: string): Promise<Trip> {

    this.logger.debug('Post request to reject a match by ' + user.login);

    const created = await this.matchService.rejectMatch(id, user.id);

    HeaderUtil.addEntityCreatedHeaders(req.res, 'Match', created.id);

    return created;
  }

  @Delete('cancel/:id')
  @Roles(RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Cancel match' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async transporterCancelsMatch(@AuthUser() user: User, @Req() req: Request, @Param('id') id: string): Promise<Trip> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Match', id);
    return await this.matchService.delete(id, user);
  }

}

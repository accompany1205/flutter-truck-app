import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Identity from '../../domain/identity.entity';
import { IdentityService } from '../../service/identity.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType, AuthUser } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';

@Controller('api/identity')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('identities')
export class IdentityController {
  logger = new Logger('IdentityController');

  constructor(private readonly identityService: IdentityService) {}

  /*
  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Identity
  })
  async getAll(@Req() req: any): Promise<Identity[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.identityService.findAndCount({
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
    type: Identity
  })
  async getOne(@Param('id') id: string): Promise<Identity> {
    return await this.identityService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create identity' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Identity
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() identity: Identity): Promise<Identity> {
    const created = await this.identityService.save(identity);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Identity', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update identity' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Identity
  })
  async put(@Req() req: Request, @Body() identity: Identity): Promise<Identity> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Identity', identity.id);
    return await this.identityService.update(identity);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete identity' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Identity> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Identity', id);
    const toDelete = await this.identityService.findById(id);
    return await this.identityService.delete(toDelete);
  }
  */

  @Get('/')
  @Roles(RoleType.CLIENT)
  async getIdentity(@AuthUser() user: User, @Res() res: Response) {
    // Call service that fetchs identity:
    const image = await this.identityService.fetchIdentity(user.id);
    // return:
    return res.sendFile(image, { root: 'files' });
  }

}

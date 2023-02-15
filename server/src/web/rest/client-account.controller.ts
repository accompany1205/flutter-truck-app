import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import ClientAccount from '../../domain/client-account.entity';
import { ClientAccountService } from '../../service/client-account.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/client-accounts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('client-accounts')
export class ClientAccountController {
  logger = new Logger('ClientAccountController');

  constructor(private readonly clientAccountService: ClientAccountService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ClientAccount
  })
  async getAll(@Req() req: any): Promise<ClientAccount[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.clientAccountService.findAndCount({
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
    type: ClientAccount
  })
  async getOne(@Param('id') id: string): Promise<ClientAccount> {
    return await this.clientAccountService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create clientAccount' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ClientAccount
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() clientAccount: ClientAccount): Promise<ClientAccount> {
    const created = await this.clientAccountService.save(clientAccount);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ClientAccount', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update clientAccount' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ClientAccount
  })
  async put(@Req() req: Request, @Body() clientAccount: ClientAccount): Promise<ClientAccount> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ClientAccount', clientAccount.id);
    return await this.clientAccountService.update(clientAccount);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete clientAccount' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<ClientAccount> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ClientAccount', id);
    const toDelete = await this.clientAccountService.findById(id);
    return await this.clientAccountService.delete(toDelete);
  }
}

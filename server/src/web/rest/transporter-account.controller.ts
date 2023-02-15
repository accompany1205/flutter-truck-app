import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TransporterAccount from '../../domain/transporter-account.entity';
import { TransporterAccountService } from '../../service/transporter-account.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/transporter-accounts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('transporter-accounts')
export class TransporterAccountController {
  logger = new Logger('TransporterAccountController');

  constructor(private readonly transporterAccountService: TransporterAccountService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TransporterAccount
  })
  async getAll(@Req() req: any): Promise<TransporterAccount[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.transporterAccountService.findAndCount({
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
    type: TransporterAccount
  })
  async getOne(@Param('id') id: string): Promise<TransporterAccount> {
    return await this.transporterAccountService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create transporterAccount' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TransporterAccount
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() transporterAccount: TransporterAccount): Promise<TransporterAccount> {
    const created = await this.transporterAccountService.save(transporterAccount);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TransporterAccount', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update transporterAccount' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TransporterAccount
  })
  async put(@Req() req: Request, @Body() transporterAccount: TransporterAccount): Promise<TransporterAccount> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TransporterAccount', transporterAccount.id);
    return await this.transporterAccountService.update(transporterAccount);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete transporterAccount' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TransporterAccount> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TransporterAccount', id);
    const toDelete = await this.transporterAccountService.findById(id);
    return await this.transporterAccountService.delete(toDelete);
  }
}

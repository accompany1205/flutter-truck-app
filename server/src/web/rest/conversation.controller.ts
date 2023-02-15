import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Conversation from '../../domain/conversation.entity';
import { ConversationService } from '../../service/conversation.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/conversations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('conversations')
export class ConversationController {
  logger = new Logger('ConversationController');

  constructor(private readonly conversationService: ConversationService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Conversation
  })
  async getAll(@Req() req: Request): Promise<Conversation[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.conversationService.findAndCount({
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
    type: Conversation
  })
  async getOne(@Param('id') id: string): Promise<Conversation> {
    return await this.conversationService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create conversation' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Conversation
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() conversation: Conversation): Promise<Conversation> {
    const created = await this.conversationService.save(conversation);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Conversation', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update conversation' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Conversation
  })
  async put(@Req() req: Request, @Body() conversation: Conversation): Promise<Conversation> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Conversation', conversation.id);
    return await this.conversationService.update(conversation);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete conversation' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Conversation> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Conversation', id);
    const toDelete = await this.conversationService.findById(id);
    return await this.conversationService.delete(toDelete);
  }
}

import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Chat from '../../domain/chat.entity';
import { ChatService } from '../../service/chat.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/chats')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('chats')
export class ChatController {
  logger = new Logger('ChatController');

  constructor(private readonly chatService: ChatService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Chat
  })
  async getAll(@Req() req: Request): Promise<Chat[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.chatService.findAndCount({
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
    type: Chat
  })
  async getOne(@Param('id') id: string): Promise<Chat> {
    
    return await this.chatService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Create chat' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Chat
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() chat: Chat): Promise<Chat> {
    const created = await this.chatService.save(chat);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Chat', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update chat' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Chat
  })
  async put(@Req() req: Request, @Body() chat: Chat): Promise<Chat> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Chat', chat.id);
    return await this.chatService.update(chat);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete chat' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Chat> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Chat', id);
    const toDelete = await this.chatService.findById(id);
    return await this.chatService.delete(toDelete);
  }
}

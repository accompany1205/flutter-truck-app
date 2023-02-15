import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Comments from '../../domain/comments.entity';
import { CommentsService } from '../../service/comments.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, AuthUser, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { commentsDTO } from '../../service/dto/comment.dto';
import { IsNull } from 'typeorm';

@Controller('api/comments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('comments')
export class CommentsController {
  logger = new Logger('CommentsController');

  constructor(private readonly commentsService: CommentsService) {}

  @Get('/')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Comments
  })
  async getAll(@Req() req: Request): Promise<Comments[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.commentsService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: {
        "createdDate": "ASC"
      }
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.CLIENT)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Comments
  })
  async getOne(@Req() req: Request, @Param('id') id: string): Promise<Comments[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.commentsService.findSortedCommentsForTrip(id, +pageRequest.page * pageRequest.size, +pageRequest.size);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @PostMethod('/')
  @Roles(RoleType.CLIENT, RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Create comments' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Comments
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@AuthUser() user: User, @Req() req: Request, @Body() comments: commentsDTO): Promise<Comments> {
    this.logger.log("POST new comment by user ", user.login);
    const created = await this.commentsService.save(comments, user);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Comments', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Update comments' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Comments
  })
  async put(@AuthUser() user: User, @Req() req: Request, @Body() comments: Comments): Promise<Comments> {
    this.logger.log("Edit comment by user ", user.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Comments', comments.id);
    return await this.commentsService.update(comments);
  }

  @Delete('/:id')
  @Roles(RoleType.CLIENT)
  @ApiOperation({ title: 'Delete comments' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@AuthUser() user: User, @Req() req: Request, @Param('id') id: string): Promise<Comments> {
    this.logger.log("Delete comment by user ", user.login);
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Comments', id);
    const toDelete = await this.commentsService.findById(id);
    return await this.commentsService.delete(user, toDelete);
  }
}

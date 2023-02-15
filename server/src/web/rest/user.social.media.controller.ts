import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, Req, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { User } from '../../domain/user.entity';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../service/user.service';

import { OAuth2Client, TokenInfo } from 'google-auth-library';

@Controller('api/social/users')
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('user-resource')
export class UserSocialMediaController {
  logger = new Logger('UserSocialMediaController');

  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: User
  })
  async getAllUsers(@Req() req: any): Promise<User[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.userService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Post('/google')
  @ApiOperation({ title: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: User
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async loginGoogleUser(@Req() req: Request): Promise<any> {

    const { idSecret } = req.body;

    // TODO: need to add has a guard or intercepter and add the clientId and screet of iOS
    const client: OAuth2Client = new OAuth2Client({
        clientId: '622396850915-meqf6otmssjibn0smse9616nen9c68ci.apps.googleusercontent.com',
        clientSecret: 'AIzaSyAdE4F_ulviLjzwUl13z4iOUaF3ezaDld8',
        redirectUri: 'https://console.developers.google.com/iam-admin/serviceaccounts/details/115420263109516749961;edit=true?previousPage=%2Fapis%2Fcredentials%3Fauthuser%3D1%26project%3Dtruck-app-6e319&authuser=1&project=truck-app-6e319'
    });

    let tokenInfo: TokenInfo;

    try {
        tokenInfo = await client.getTokenInfo(idSecret);
    }catch(e){
        this.logger.error(e);
        throw new HttpException('Token not auth.', HttpStatus.UNAUTHORIZED);
    }

    const userFind = await this.userService.findByfields({ where: { email: tokenInfo.email } });

    console.log(tokenInfo.email);
    console.log(userFind);

    if (!userFind) {
      throw new HttpException('Not registed.', HttpStatus.NO_CONTENT);
    }
    return {
        token: '',
        user: userFind
    };
  }

  @Post('/facebook')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: User
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async loginFacebookUser(@Req() req: Request, @Body() user: User): Promise<User> {

    const userFind = await this.userService.findByfields({ where: { login: user.login } });

    if (userFind) {
      throw new HttpException('Email is already registered.', HttpStatus.BAD_REQUEST);
    }

    // must fix after when verify user
    user.activated = true;
    user.verifiedEmail = false;

    const created = await this.userService.save(user);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);
    return created;
  }

}

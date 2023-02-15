import { Body, Param, Post, Res, UseGuards, Controller, Get, Logger, Req, UseInterceptors, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard, RolesGuard, Roles, RoleType } from '../../security';
import { User } from '../../domain/user.entity';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

// Interceptors:
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { AuditInterceptor } from '../../client/interceptors/audit.interceptor';

// Services:
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';

// Decorators:
import { AuthUser } from '../../security/decorators/auth-user.decorator';

// DTOs:
import { UserLoginDTO } from '../../service/dto/user-login.dto';
import { UserPasswordChangeDTO } from '../../service/dto/user-password-change.dto';


@Controller('api')
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('account-resource')
export class AccountController {
  logger = new Logger('AccountController');

  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

  // This is to illustrate the use of interceptor
  @Post('/register')
  @UseGuards(AuthGuard)
  @UseInterceptors(AuditInterceptor)
  @ApiOperation({ title: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'Registered user',
    type: User
  })
  registerAccount(@AuthUser() user: User, @Body() body: any, @Res() res: Response): any {
    console.log(body);
    return res.sendStatus(201);
  }

  @Get('/activate')
  @ApiOperation({ title: 'Activate an account' })
  @ApiResponse({
    status: 200,
    description: 'activated'
  })
  activateAccount(@Param() key: string, @Res() res: Response): any {
    return res.sendStatus(200);
  }


  @Post('/authenticate')
  @ApiOperation({ title: 'Authorization api retrieving token' })
  @ApiResponse({
    status: 201,
    description: 'Authorized'
  })
  async authorize(@Req() req: Request, @Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {
    this.logger.debug('Post request to authenticate ' + user.username);

    const jwt = await this.authService.login(user);
    res.setHeader('Authorization', 'Bearer ' + jwt.id_token);
    return res.json(jwt);
  }

  @Get('/authenticate')
  @ApiOperation({ title: 'Check if the user is authenticated' })
  @ApiResponse({
    status: 200,
    description: 'login authenticated'
  })
  isAuthenticated(@AuthUser() user: User): any {
    this.logger.debug('Post request to authenticate ', user.login);
    return user.login;
  }

  @Get('/account')
  @UseGuards(AuthGuard)
  @ApiOperation({ title: 'Get the current user.' })
  @ApiResponse({
    status: 200,
    description: 'user retrieved'
  })
  async getAccount(@AuthUser() user: User): Promise<any> {
    delete user.password;
    return await user;
  }

  @Post('/account')
  @ApiOperation({ title: 'Update the current user information' })
  @ApiResponse({
    status: 201,
    description: 'user info updated',
    type: User
  })
  saveAccount(@Req() req: Request, @Body() user: User, @Res() res: Response): any {
    return res.sendStatus(201);
  }



  @Post('account/change-password')
  @ApiOperation({ title: 'Change current password' })
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'user password changed',
    type: User
  })
  async changePassword(@AuthUser() user: User, @Body() userPasswordDto: UserPasswordChangeDTO, @Res() res: Response): Promise<any> {
    this.logger.debug('Post request to create change password');
    // Add Interceptor on password requirements !

    const newPassword = userPasswordDto.newPassword;
    const oldPassword = userPasswordDto.oldPassword;

    const passStatus: boolean = await this.userService.comparePasswords(oldPassword, user.password);

    if (passStatus) {
      user.password = newPassword;
      await this.userService.update(user);
      return res.json(true);
    } else {
      throw new HttpException("The passwords is incorrect", HttpStatus.BAD_REQUEST);
    }
  }


  @Post('/account/reset-password/init')
  @ApiOperation({ title: 'Send an email to reset the password of the user' })
  @ApiResponse({
    status: 201,
    description: 'mail to reset password sent',
    type: 'string'
  })
  requestPasswordReset(@Req() req: Request, @Body() email: string, @Res() res: Response): any {
    return res.sendStatus(201);
  }

  @Post('/account/reset-password/finish')
  @ApiOperation({ title: 'Finish to reset the password of the user' })
  @ApiResponse({
    status: 201,
    description: 'password reset',
    type: 'string'
  })
  finishPasswordReset(@Req() req: Request, @Body() keyAndPassword: string, @Res() res: Response): any {
    return res.sendStatus(201);
  }
}

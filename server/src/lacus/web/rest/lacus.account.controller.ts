
import { Body, Post, Get, Res, Controller, Logger, Req, UseInterceptors, HttpException, HttpStatus, UploadedFiles, Param, Put, UseGuards } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import * as fs from 'fs';
import { LoggingInterceptor } from '../../../client/interceptors/logging.interceptor';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { UserService } from '../../../service/user.service';
import ClientAccount from '../../../domain/client-account.entity';

import { HeaderUtil } from '../../../client/header-util';
import { User } from '../../../domain/user.entity';
import TransporterAccount from '../../../domain/transporter-account.entity';
import { AuthUser } from '../../../security/decorators/auth-user.decorator';

import { AuthGuard, RoleType, Roles } from '../../../security';
import { ClientAccountService } from '../../../service/client-account.service';
import { TransporterAccountService } from '../../../service/transporter-account.service';

@Controller('api/lacus/')
@UseInterceptors(LoggingInterceptor)
@ApiUseTags('Extended entities: Account Management')
export class LacusAccountController {

  logger = new Logger('LacusAccountController');

  constructor(private readonly userService: UserService,
    private readonly clientAccountService: ClientAccountService,
    private readonly transporterAccountService: TransporterAccountService) { }

  @Get('avatar/:imgPath')
  async getAvatar(@Param('imgPath') image: string, @Res() res: Response): Promise<void> {
    return res.sendFile(image, { root: 'files'});
  }

  @Put('client-account')
  @Roles(RoleType.CLIENT)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'identity', maxCount: 1 },
    ])
  )
  @ApiOperation({ title: 'Register client user' })
  @ApiResponse({
    status: 201,
    description: 'Registered client user',
    type: User
  })
  async updateLacusClientAccount(@AuthUser() user: User, @Req() req: Request, @UploadedFiles() files, @Body() clientUser: ClientAccount): Promise<ClientAccount> {

    let newIdentityPath = null;
    let newAvatarPath = null;

    if(user.id !== clientUser.user.id){
      this.logger.error('User {} trying to update user {}', user.id, clientUser.id);
      throw new HttpException('You are trying to update the wrong user.', HttpStatus.UNAUTHORIZED);
    }

    delete clientUser.user.password;
    delete clientUser.user.verifiedEmail;
    delete clientUser.user.verifiedPhone;
    delete clientUser.user.activated;
    delete clientUser.user.imageUrl;
    delete clientUser.user.stripeId;

    if (files && files.avatar) {
      // rename the file
      newAvatarPath = './files/avatar_client_' + clientUser.user.email + '_' + files.avatar[0].filename;
      fs.renameSync('./' + files.avatar[0].path, newAvatarPath);
      clientUser.user.imageUrl = newAvatarPath;
    }

    if (files && files.identity) {
      newIdentityPath = './files/identity_client' + clientUser.user.email + '_' + files.identity[0].filename;
      fs.renameSync('./' + files.identity[0].path, newIdentityPath);
      clientUser.identity.imageUrl = newIdentityPath;
    }

    try {
      let created: ClientAccount = await this.clientAccountService.save(clientUser);
      HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);
      return created;
    } catch (e) {
      // Ommit all loaded files in case of failure !
      if (files && files.avatar) {
        fs.unlinkSync(newAvatarPath);
      }
      if(files && files.identity){
        fs.unlinkSync(newIdentityPath);
      }
      this.logger.error('Cannot update clientUser {}', clientUser.id);
      this.logger.error(e);
      throw new HttpException('Internal error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Put('transporter-account')
  @UseGuards(AuthGuard)
  @Roles(RoleType.CLIENT)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'insurance', maxCount: 1 },
      { name: 'patent', maxCount: 1 },
    ])
  )
  @ApiOperation({ title: 'Register client user' })
  @ApiResponse({
    status: 201,
    description: 'Registered client user',
    type: User
  })
  async updateTransoporterAccount(@AuthUser() user: User, @Req() req: Request, @UploadedFiles() files, @Body() transporterAccount: TransporterAccount): Promise<TransporterAccount> {

    let newInsurancePath = null;
    let newPatentPath = null;
    let newAvatarPath = null;

    if(user.id !== transporterAccount.user.id){
      this.logger.error('User {} trying to update user {}', user.id, transporterAccount.id);
      throw new HttpException('You are trying to update the wrong user.', HttpStatus.UNAUTHORIZED);
    }

    delete transporterAccount.user.password;
    delete transporterAccount.user.verifiedEmail;
    delete transporterAccount.user.verifiedPhone;
    delete transporterAccount.user.activated;
    delete transporterAccount.user.imageUrl;
    delete transporterAccount.insurance;
    delete transporterAccount.insuranceContentType;
    delete transporterAccount.patent;
    delete transporterAccount.patentContentType;
    delete transporterAccount.user.stripeId;


    if (files && files.avatar) {
      // rename the file
      newAvatarPath = './files/avatar_client_' + transporterAccount.user.email + '_' + files.avatar[0].filename;
      fs.renameSync('./' + files.avatar[0].path, newAvatarPath);
      transporterAccount.user.imageUrl = newAvatarPath;
    }

    if (files && files.insurance) {
      // rename the file
      newInsurancePath = './files/insurance_client_' + transporterAccount.user.email + '_' + files.insurance[0].filename;
      fs.renameSync('./' + files.insurance[0].path, newInsurancePath);
      transporterAccount.insurance = newInsurancePath;
    }

    if (files && files.patent) {
      // rename the file
      newPatentPath = './files/patent_client_' + transporterAccount.user.email + '_' + files.patent[0].filename;
      fs.renameSync('./' + files.patent[0].path, newPatentPath);
      transporterAccount.patent = newPatentPath;
    }

    try {
      let created: TransporterAccount = await this.transporterAccountService.update(transporterAccount);
      HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);
      return created;
    } catch (e) {
      // Ommit all loaded files in case of failure !
      if (files && files.avatar) {
        fs.unlinkSync(newAvatarPath);
      }
      if (files && files.insurance) {
        fs.unlinkSync(newInsurancePath);
      }
      if (files && files.patent) {
        fs.unlinkSync(newPatentPath);
      }
      this.logger.error(e);
      throw new HttpException('Internal error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register-client')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'identity', maxCount: 1 },
    ])
  )
  @ApiOperation({ title: 'Register client user' })
  @ApiResponse({
    status: 201,
    description: 'Registered client user',
    type: User
   })
  async registerLacusClientAccount(@Req() req: Request, @UploadedFiles() files, @Body() clientUser: ClientAccount): Promise<any> {

    let newIdentityPath = null;
    let newAvatarPath = null;

    const userFind = await this.userService.findByfields({ where: { login: clientUser.user.login } });

    if (userFind) {
      this.logger.warn("user {} already registered ", clientUser.user.login )
      throw new HttpException('Email is already registered.', HttpStatus.BAD_REQUEST);
    }

    delete clientUser.user.imageUrl;
    clientUser.user.activated = false;
    clientUser.user.verifiedPhone = false;
    clientUser.user.verifiedEmail = false;

    if (files && files.avatar) {
      // rename the file
      newAvatarPath = './files/avatar_client_' + clientUser.user.email + '_' + files.avatar[0].filename;
      fs.renameSync('./' + files.avatar[0].path, newAvatarPath);
      clientUser.user.imageUrl = 'avatar_client_' + clientUser.user.email + '_' + files.avatar[0].filename;
    }

    if (files && files.identity) {
      newIdentityPath = './files/identity_client' + clientUser.user.email + '_' + files.identity[0].filename;
      fs.renameSync('./' + files.identity[0].path, newIdentityPath);
      clientUser.identity.imageUrl = 'identity_client' + clientUser.user.email + '_' + files.identity[0].filename
    }

    try {
      let created: any = await this.userService.saveClient(clientUser);
      await this.userService.createEmailToken(created.user.login);
      const state = await this.userService.sendEmailVerification(created.user.login);
      delete created.user.password;
      HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);
      return created;
    } catch (e) {
      // Ommit all loaded files in case of failure !
      if (files && files.avatar) {
        fs.unlinkSync(newAvatarPath);
      }
      if (files && files.identity) {
        fs.unlinkSync(newIdentityPath);
      }
      this.logger.error(e);
      throw new HttpException('Internal error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register-transporter')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'insurance', maxCount: 1 },
      { name: 'patent', maxCount: 1 }
    ])
  )
  @ApiOperation({ title: 'Register transporter user' })
  @ApiResponse({
    status: 201,
    description: 'Registered transporter user',
    type: User
  })
  async registerLacusTransporterAccount(@Req() req: Request, @UploadedFiles() files, @Body() transporterUser: TransporterAccount): Promise<User> {

    let newInsurancePath = null;
    let newAvatarPath = null;
    let newPatentPath = null;
    console.log(transporterUser);

    const userFind = await this.userService.findByfields({ where: { login: transporterUser.user.login } });

    if (userFind) {
      this.logger.warn("user {} already registered ", transporterUser.user.login )
      throw new HttpException('Email is already registered.', HttpStatus.BAD_REQUEST);
    }

    delete transporterUser.user.imageUrl;
    delete transporterUser.insurance;
    delete transporterUser.insuranceContentType;
    delete transporterUser.patent;
    delete transporterUser.patentContentType;
    transporterUser.user.activated = false;
    transporterUser.user.verifiedPhone = false;
    transporterUser.user.verifiedEmail = false;
    transporterUser.balance = 0;


    if (files && files.avatar) {
      // rename the file
      newAvatarPath = './files/avatar_client_' + transporterUser.user.email + '_' + files.avatar[0].filename;
      fs.renameSync('./' + files.avatar[0].path, newAvatarPath);
      transporterUser.user.imageUrl = 'avatar_client_' + transporterUser.user.email + '_' + files.avatar[0].filename;
    }

    if (files && files.insurance) {
      newInsurancePath = './files/insurance_client' + transporterUser.user.email + '_' + files.insurance[0].filename;
      fs.renameSync('./' + files.insurance[0].path, newInsurancePath);
      transporterUser.insurance = 'insurance_client' + transporterUser.user.email + '_' + files.insurance[0].filename;
    }

    if (files && files.patent) {
      newPatentPath = './files/insurance_client' + transporterUser.user.email + '_' + files.patent[0].filename;
      fs.renameSync('./' + files.insurance[0].path, newPatentPath);
      transporterUser.patent = 'insurance_client' + transporterUser.user.email + '_' + files.patent[0].filename;
    }

    try {
      let created: any = await this.userService.saveTransporter(transporterUser);
      await this.userService.createEmailToken(created.user.login);
      const state = await this.userService.sendEmailVerification(created.user.login);
      delete created.password;
      HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);
      return created;
    } catch (e) {
      if (files && files.avatar) {
        fs.unlinkSync(newAvatarPath);
      }
      if (files && files.insurance) {
        fs.unlinkSync(newInsurancePath);
      }
      if (files && files.patent) {
        fs.unlinkSync(newPatentPath);
      }
      this.logger.error(e);
      throw new HttpException('Internal error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @ApiResponse({
    status: 200,
    description: 'Successfully send verification code',
  })
  @ApiResponse({ status: 403, description: 'User not found' })
  @Get('email/resend-verification/:email')
  async sendEmailVerification(@Param('email') email: string) {
    await this.userService.createEmailToken(email);
    return await this.userService.sendEmailVerification(email);
  }

  @ApiResponse({ status: 200, description: 'Successfully verified email' })
  @ApiResponse({ status: 403, description: 'Invalid token' })
  @Get('email/verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const verified = await this.userService.verifyEmail(token);
    if (verified) {
      res.redirect('http://localhost:8080');
    }
  }

}

/*
@Put('user')
@ApiOperation({ title: 'Update the current user information' })
@ApiResponse({
  status: 201,
  description: 'user info updated',
  type: User
})
saveAccount(@UserDecorator() user: number, @Body() user: User): any {
  // check if User is changing his own password !
  const userFind = await this.userService.findByfields({ where: { login: user.login } });

  if (userFind) {
    userFind.password = newPassword;
    return await this.userService.update(userFind);
  } else {
    return res.sendStatus(401);
  }
  */


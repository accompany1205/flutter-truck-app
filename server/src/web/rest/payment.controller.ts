import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentService } from '../../service/payment.service';
import { AuthGuard, Roles, RolesGuard, RoleType, AuthUser } from '../../security';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { stripeCreationDTO } from '../../service/dto/stripe-creation.dto';
import Stripe from 'stripe';
import { stripeConfirmationDTO } from '../../service/dto/stripe-confimation.dto';
import { UserService } from '../../service/user.service';

@Controller('api/payment')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('oayment')
export class PayementController {
  logger = new Logger('Payment Controller');

  constructor(private readonly paymentService: PaymentService, private readonly userService: UserService) {}

  @Get('/')
  @Roles(RoleType.TRANSPORTER)
  @ApiResponse({
    status: 200,
    description: 'List all records'
  })
  async getAll(@AuthUser() user: User, @Req() req: Request): Promise<Stripe.ApiListPromise<Stripe.PaymentMethod>> {
      
    this.logger.debug('Getting all  payment cards for user {}', user.login );

    return await this.paymentService.getAllCard(user);
  }

  @Delete('/:id')
  @Roles(RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Delete Payment' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@AuthUser() user: User, @Req() req: Request, @Param('id') id: string): Promise<Stripe.Response<Stripe.PaymentMethod>> {

    this.logger.debug('Deleting a payment card for user {}', user.login );

    return this.paymentService.deleteCard(user, id);
  }

  @PostMethod('/')
  @Roles(RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Create Payment' })
  @UseInterceptors(LoggingInterceptor)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@AuthUser() user: User, @Req() req: Request, @Body() card: stripeCreationDTO): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    
    this.logger.debug('Adding a payment card for user {}', user.login );

    return this.paymentService.addCard(user, card.id);
  }

  @Get('/intent/:id')
  @Roles(RoleType.TRANSPORTER)
  @UseInterceptors(LoggingInterceptor)
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async getOne(@AuthUser() user: User, @Param('id') id: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    this.logger.debug('User {} is Intenting to pay', user.login );
    return await this.paymentService.createIntent(id, user);
  }

  @PostMethod('/intent')
  @Roles(RoleType.TRANSPORTER)
  @ApiOperation({ title: 'Create Payment intent' })
  @UseInterceptors(LoggingInterceptor)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createPaymentIntent(@AuthUser() user: User, @Req() req: Request, @Body() stripeConfirmation: stripeConfirmationDTO): Promise<any> {

    this.logger.debug('User {} is Intenting to pay', user.login );

    const response: boolean = await this.paymentService.confirmIntent(stripeConfirmation.id, user);
    
    if(!response){
        this.logger.debug('Payment has failed for user {}', user.login);
        throw new HttpException('The payment didnt succeed', HttpStatus.UNAUTHORIZED);
    }

    const userFound = await this.userService.findById(user.id, ['transporterAccount']);

    return {
      ok: response,
      balance: userFound.transporterAccount.balance,
      endOfSubscription: userFound.transporterAccount.endOfSubscription
    };
  }

}

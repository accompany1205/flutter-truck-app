import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '../domain/user.entity';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import Plan from '../domain/plan.entity';
import { PlanService } from './plan.service';
import { UserService } from './user.service';

@Injectable()
export class PaymentService {
  logger = new Logger('Payment Service');

  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly planService: PlanService,
    private readonly userService: UserService
  ) {}

  async getAllCard(user: User): Promise<Stripe.ApiListPromise<Stripe.PaymentMethod> | undefined>{
    return await this.stripeClient.paymentMethods.list({customer: user.stripeId, type: 'card'})
  }

  async addCard(user: User, cardId: string): Promise<Stripe.Response<Stripe.PaymentMethod>>{
    return await this.stripeClient.paymentMethods.attach(cardId, {customer: user.stripeId});
  }

  async deleteCard(user: User, cardId: string): Promise<Stripe.Response<Stripe.PaymentMethod>>{

    const card = await this.stripeClient.paymentMethods.retrieve(cardId);

    if(card.customer !== user.stripeId){
      this.logger.warn('IMPORTANT: This guy ({}) is doing some silly things ! ', user.login);
      throw new HttpException('You are not allowed !', HttpStatus.UNAUTHORIZED);
    }

    return await this.stripeClient.paymentMethods.detach(cardId);
  }

  async createIntent(id: string, user: User): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const plan: Plan = await this.planService.findById(id);
    return await this.stripeClient.paymentIntents.create({
      amount: plan.price * 100,
      currency: 'mad',
      payment_method_types: ['card'],
      metadata: { 'plan_id': plan.id },
      customer: user.stripeId
    })
  }

  async confirmIntent(id: string, user: User): Promise<boolean> {
    const response: Stripe.Response<Stripe.PaymentIntent> = await this.stripeClient.paymentIntents.retrieve(id);
    if(user.stripeId === response.customer && response.status === 'succeeded') {
      const plan: Plan = await this.planService.findById(response.metadata['plan_id']);
      this.userService.AddBalance(user.id, plan.kilometers, plan.months);
      return true;
    } else {
      return false;
    }
    
  }

}

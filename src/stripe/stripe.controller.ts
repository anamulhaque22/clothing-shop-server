import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBody,
} from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeService } from './stripe.service';

@Controller({
  path: 'stripe',
  version: '1',
})
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  @HttpCode(HttpStatus.OK)
  async createPaymentIntent(@Body() orderItems: CreatePaymentIntentDto) {
    return this.stripeService.createPaymentIntent(orderItems);
  }

  @Post('webhook')
  async handleStripeWebhook(
    @RawBody() body: any,
    @Headers() headers: Record<string, string>,
  ) {
    return this.stripeService.paymentIntentWebhook(body, headers);
  }
}

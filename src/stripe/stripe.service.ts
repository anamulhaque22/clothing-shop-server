import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { OrdersService } from 'src/orders/orders.service';
import { PaymentService } from 'src/payment/payment.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PAYMENT_PROVIDER } from './payment-provider.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly paymentService: PaymentService,
    private readonly orderService: OrdersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: configService.get('stripe.apiVersion', { infer: true }),
    });
  }

  // async getPaymentByOrderIdAndStatus(
  //   orderId: number,
  //   status: PAYMENT_STATUS,
  // ): Promise<PaymentEntity> {
  //   return this.paymentRepo.findOneBy({
  //     order: { id: orderId },
  //     status,
  //   });
  // }

  async createPaymentIntent(data: CreatePaymentIntentDto) {
    const products = await this.orderService.orderItemsValidation(
      data.orderItems,
    );
    const totalAmount = this.orderService.calculateTotalAmount(
      data.orderItems,
      products,
    );

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await this.paymentService.createPayment({
      transaction_id: paymentIntent.id,
      amount: totalAmount,
      payment_provider: PAYMENT_PROVIDER.STRIPE,
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async paymentIntentWebhook(
    event: Stripe.Event,
    headers: Record<string, string>,
  ) {
    const sig = headers['stripe-signature'];
    const webhookSecret = this.configService.get('stripe.webhookSecret', {
      infer: true,
    });
    try {
      event = this.stripe.webhooks.constructEvent(
        event as any,
        sig,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
    if (
      ![
        'payment_intent.succeeded',
        'payment_intent.canceled',
        'payment_intent.payment_failed',
      ].includes(event.type)
    ) {
      return;
    }
    const data = event.data.object as Stripe.PaymentIntent;
    const payment = null;
    //= await this.paymentRepo.findOne({
    //   where: { transaction_id: data.id },
    // });

    switch (event.type) {
      case 'payment_intent.succeeded':
        if (payment) {
          // payment.status = PAYMENT_STATUS.SUCCESS;
          // await this.paymentRepo.save(payment);
        }
        break;
      case 'payment_intent.canceled':
        if (payment) {
          // payment.status = PAYMENT_STATUS.CANCELED;
          // await this.paymentRepo.save(payment);
        }
        break;
      case 'payment_intent.payment_failed':
        if (payment) {
          // payment.status = PAYMENT_STATUS.FAILED;
          // await this.paymentRepo.save(payment);
        }
        break;
      default:
        console.log('Unhandled event type', event.type);
    }
  }

  async cancelIntent(id: string) {
    return await this.stripe.paymentIntents.cancel(id);
  }
}

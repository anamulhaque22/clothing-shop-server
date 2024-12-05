import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentModule } from 'src/payment/payment.module';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [PaymentModule, OrdersModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}

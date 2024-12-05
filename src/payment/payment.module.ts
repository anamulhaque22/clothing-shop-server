import { Module } from '@nestjs/common';
import { PaymentTypeormModule } from './infrastructure/payment-typeorm.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [PaymentTypeormModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

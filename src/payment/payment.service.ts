import { Injectable } from '@nestjs/common';
import { PAYMENT_PROVIDER } from 'src/stripe/payment-provider.enum';
import { QueryRunner } from 'typeorm';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './infrastructure/payment.repository';
import { PAYMENT_STATUS } from './payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepository) {}

  async createPayment(
    data: {
      amount: number;
      orderId?: number;
      transaction_id: string;
      payment_provider: PAYMENT_PROVIDER;
    },
    queryRunner?: QueryRunner,
  ) {
    return this.paymentRepo.createPayment(data, queryRunner);
  }

  async getPaymentByTransactionId(
    transactionId: string,
    queryRunner?: QueryRunner,
  ) {
    return this.paymentRepo.getPaymentByTransactionId(
      transactionId,
      queryRunner,
    );
  }

  async changePaymentStatus(
    transaction_id: string,
    status: PAYMENT_STATUS,
    queryRunner?: QueryRunner,
  ) {
    return this.paymentRepo.changePaymentStatus(
      transaction_id,
      status,
      queryRunner,
    );
  }

  async updatePayment(
    transaction_id: string,
    data: UpdatePaymentDto,
    queryRunner?: QueryRunner,
  ) {
    return this.paymentRepo.updatePayment(transaction_id, data, queryRunner);
  }
}

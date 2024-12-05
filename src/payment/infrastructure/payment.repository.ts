import { QueryRunner } from 'typeorm';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';

export abstract class PaymentRepository {
  abstract createPayment(
    data: CreatePaymentDto,
    queryRunner?: QueryRunner,
  ): Promise<PaymentEntity>;
  abstract getPaymentByTransactionId(
    transactionId: string,
    queryRunner?: QueryRunner,
  ): Promise<PaymentEntity>;

  abstract changePaymentStatus(
    transaction_id: string,
    status: string,
    queryRunner?: QueryRunner,
  ): Promise<void>;

  abstract updatePayment(
    transaction_id: string,
    data: UpdatePaymentDto,
    queryRunner?: QueryRunner,
  ): Promise<void>;
}

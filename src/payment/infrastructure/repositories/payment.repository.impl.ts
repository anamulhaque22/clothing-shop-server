import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/orders/infrastructure/entities/order.entity';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { UpdatePaymentDto } from 'src/payment/dto/update-payment.dto';
import { PAYMENT_STATUS } from 'src/payment/payment-status.enum';
import { QueryRunner, Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentRepository } from '../payment.repository';

export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async createPayment(
    data: CreatePaymentDto,
    queryRunner?: QueryRunner,
  ): Promise<PaymentEntity> {
    const payment = new PaymentEntity();
    payment.amount = data.amount;
    payment.transaction_id = data.transaction_id;
    payment.payment_provider = data.payment_provider;

    let order = new OrderEntity();
    if (data?.orderId) {
      order.id = data.orderId;
      payment.order = order;
    }

    if (queryRunner) {
      return await queryRunner.manager.save(PaymentEntity, payment);
    } else {
      return await this.paymentRepository.save(payment);
    }
  }

  async changePaymentStatus(
    transaction_id: string,
    status: PAYMENT_STATUS,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      const payment = await queryRunner.manager.findOne(PaymentEntity, {
        where: { transaction_id },
      });

      await queryRunner.manager.save(PaymentEntity, { ...payment, status });
    } else {
      const payment = await this.paymentRepository.findOneBy({
        transaction_id,
      });

      await this.paymentRepository.save({ ...payment, status });
    }
  }

  async getPaymentByTransactionId(
    transactionId: string,
    queryRunner?: QueryRunner,
  ): Promise<PaymentEntity> {
    return queryRunner
      ? queryRunner.manager.findOne(PaymentEntity, {
          where: { transaction_id: transactionId },
        })
      : this.paymentRepository.findOneBy({ transaction_id: transactionId });
  }

  async updatePayment(
    transaction_id: string,
    data: UpdatePaymentDto,
    queryRunner?: QueryRunner,
  ) {
    let order = new OrderEntity();
    order.id = data.orderId;

    delete data.orderId;
    if (queryRunner) {
      const payment = await queryRunner.manager.findOne(PaymentEntity, {
        where: { transaction_id },
      });

      await queryRunner.manager.save(PaymentEntity, {
        ...payment,
        ...data,
        order: order,
      });
    } else {
      const payment = await this.paymentRepository.findOneBy({
        transaction_id,
      });

      await this.paymentRepository.save(
        this.paymentRepository.create({
          ...payment,
          ...data,
          order: order,
        }),
      );
    }
  }
}

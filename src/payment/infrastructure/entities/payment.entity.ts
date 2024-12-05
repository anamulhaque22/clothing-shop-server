import { OrderEntity } from 'src/orders/infrastructure/entities/order.entity';
import { PAYMENT_STATUS } from 'src/payment/payment-status.enum';
import { PAYMENT_PROVIDER } from 'src/stripe/payment-provider.enum';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'payments',
})
export class PaymentEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  status: PAYMENT_STATUS;

  @Column({
    type: 'enum',
    enum: PAYMENT_PROVIDER,
    default: PAYMENT_PROVIDER.STRIPE,
  })
  payment_provider: PAYMENT_PROVIDER;

  @Column()
  transaction_id: string;

  @ManyToOne(() => OrderEntity, (order) => order.payments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  order?: OrderEntity;

  @CreateDateColumn()
  createdAt: Date;
}

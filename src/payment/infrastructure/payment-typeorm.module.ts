import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentRepository } from './payment.repository';
import { PaymentRepositoryImpl } from './repositories/payment.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    {
      provide: PaymentRepository,
      useClass: PaymentRepositoryImpl,
    },
  ],
  exports: [PaymentRepository],
})
export class PaymentTypeormModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import { OrderRepositoryImpl } from './repositories/order.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  providers: [
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
  ],
  exports: [OrderRepository],
})
export class OrderTypeOrmModule {}

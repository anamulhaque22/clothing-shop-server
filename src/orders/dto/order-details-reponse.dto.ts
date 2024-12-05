import { PickType } from '@nestjs/mapped-types';
import { Payment } from 'src/payment/domain/payment';
import { Product } from 'src/products/domain/product';
import { Order, OrderItem } from '../domain/order';

export class OrderItemsResponseDto extends PickType(OrderItem, [
  'id',
  'color',
  'price',
  'quantity',
  'size',
  'colorCode',
] as const) {
  product: Pick<Product, 'id' | 'images' | 'title' | 'description'>;
}

export class OrderDetailsResponseDto extends PickType(Order, [
  'id',
  'totalAmount',
  'status',
  'createdAt',
  'billingAddress',
  'shippingAddress',
  'user',
  'updatedAt',
]) {
  orderItems: OrderItemsResponseDto[];
  payments?: Payment[] | null;
  successPayment?: Payment | null;
}

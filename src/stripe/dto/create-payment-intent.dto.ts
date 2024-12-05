import { PickType } from '@nestjs/mapped-types';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

export class CreatePaymentIntentDto extends PickType(CreateOrderDto, [
  'orderItems',
] as const) {}

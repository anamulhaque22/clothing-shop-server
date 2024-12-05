import { IsEnum } from 'class-validator';
import { ORDER_STATUS } from '../orders.enum';

export class UpdateOrderStatusDto {
  @IsEnum(ORDER_STATUS)
  orderStatus: ORDER_STATUS;
}

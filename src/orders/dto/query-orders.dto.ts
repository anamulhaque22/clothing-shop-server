import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PAYMENT_STATUS } from 'src/payment/payment-status.enum';
import { Order } from '../domain/order';
import { ORDER_STATUS } from '../orders.enum';

export class SortOrderDto {
  @Type(() => String)
  @IsString()
  orderBy: keyof Order;

  @IsString()
  order: string;
}

export class FilterOrderDto {
  @IsString()
  @IsOptional()
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;

  @IsString()
  @IsOptional()
  @IsEnum(PAYMENT_STATUS)
  paymentStatus?: PAYMENT_STATUS | null;
}

export class QueryOrdersDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortOrderDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortOrderDto)
  sort?: SortOrderDto[] | null;

  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(FilterOrderDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested()
  @Type(() => FilterOrderDto)
  filters?: FilterOrderDto | null;

  @IsOptional()
  @IsString()
  search?: string;
}

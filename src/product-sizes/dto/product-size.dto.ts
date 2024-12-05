import { IsNumber } from 'class-validator';
import { ProductSize } from '../domain/product-size';

export class ProductSizeDto extends ProductSize {
  @IsNumber()
  id: number;
}

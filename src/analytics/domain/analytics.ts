import { PickType } from '@nestjs/mapped-types';
import { Product } from 'src/products/domain/product';

export class MonthlyRevenue {
  month: string;
  revenue: number;
}

export class BestSellingProducts extends PickType(Product, [
  'id',
  'sellPrice',

  'title',
] as const) {
  orders: number;
  totalRevenue: number;
  stock: number; // product stoack
  images: string[];
  totalOrderdQuantity: number;
}

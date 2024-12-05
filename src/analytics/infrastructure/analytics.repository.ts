import { Injectable } from '@nestjs/common';
import { NullableType } from 'src/utils/types/nullable.type';
import { BestSellingProducts, MonthlyRevenue } from '../domain/analytics';

@Injectable()
export abstract class AnalyticsRepository {
  abstract getTotalRevenue(): Promise<NullableType<number>>;
  abstract getTotalProducts(): Promise<NullableType<number>>;
  abstract getTatalActiveUsers(): Promise<NullableType<number>>;
  abstract getTotalOrders(): Promise<NullableType<number>>;
  abstract getMnthlyRevenue(): Promise<NullableType<MonthlyRevenue>>;
  abstract getBestSellingProducts(): Promise<NullableType<BestSellingProducts>>;
}

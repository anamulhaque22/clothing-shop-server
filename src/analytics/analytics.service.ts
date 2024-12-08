import { Injectable } from '@nestjs/common';
import { NullableType } from 'src/utils/types/nullable.type';
import { MonthlyRevenue } from './domain/analytics';
import { AnalyticsRepository } from './infrastructure/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepo: AnalyticsRepository) {}

  async getBestSellingProducts() {
    return this.analyticsRepo.getBestSellingProducts();
  }

  async getMonthlyRevenue(): Promise<NullableType<MonthlyRevenue>> {
    return this.analyticsRepo.getMnthlyRevenue();
  }

  async getDashboardMetrics() {
    const totalRevenue = await this.analyticsRepo.getTotalRevenue();
    const totalActiveCustomers = await this.analyticsRepo.getTatalActiveUsers();
    const totalOrders = await this.analyticsRepo.getTotalOrders();
    const totalProducts = await this.analyticsRepo.getTotalProducts();

    return {
      totalRevenue: totalRevenue[0]?.totalRevenue,
      totalActiveCustomers: totalActiveCustomers[0]?.activeUsers,
      totalOrders: totalOrders[0]?.totalOrders,
      totalProducts: totalProducts[0]?.totalProducts,
    };
  }
}

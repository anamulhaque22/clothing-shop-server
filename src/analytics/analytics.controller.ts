import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/roles/roles.decorators';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { NullableType } from 'src/utils/types/nullable.type';
import { AnalyticsService } from './analytics.service';
import { MonthlyRevenue } from './domain/analytics';

@Controller({
  version: '1',
  path: 'analytics',
})
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin, RoleEnum.user)
  @Get('best-selling-products')
  async getBestSellingProducts() {
    return this.analyticsService.getBestSellingProducts();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin)
  @Get('monthly-revenue')
  async getMonthlyRevenue(): Promise<NullableType<MonthlyRevenue>> {
    return this.analyticsService.getMonthlyRevenue();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin)
  @Get('dashboard-metrics')
  async getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }
}

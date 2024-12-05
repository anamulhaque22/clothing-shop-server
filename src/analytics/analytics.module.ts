import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsPersistenceModule } from './infrastructure/analytics-persistence.module';

@Module({
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [],
  imports: [AnalyticsPersistenceModule],
})
export class AnalyticsModule {}

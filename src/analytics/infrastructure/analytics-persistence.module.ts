import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/infrastructure/entities/product.entity';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsRepositoryImpl } from './repositories/analytics.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    {
      provide: AnalyticsRepository,
      useClass: AnalyticsRepositoryImpl,
    },
  ],
  exports: [AnalyticsRepository],
})
export class AnalyticsPersistenceModule {}

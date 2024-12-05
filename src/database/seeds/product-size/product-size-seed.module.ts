import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSizeEntity } from 'src/product-sizes/infrastructure/entities/product-size.entity';
import { ProductSizeSeedService } from './product-size-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSizeEntity])],
  providers: [ProductSizeSeedService],
  exports: [ProductSizeSeedService],
})
export class ProductSizeSeedModule {}

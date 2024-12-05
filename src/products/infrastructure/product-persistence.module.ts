import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageEntity } from './entities/product-image.entity';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { ProductRepositoryImpl } from './repositories/product.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductImageEntity])],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImpl,
    },
  ],
  exports: [ProductRepository],
})
export class ProductPersistenceModule {}

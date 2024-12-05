import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repositoty';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepositoryImpl } from './repositories/cateogry.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
  ],
  exports: [CategoryRepository],
})
export class CategoryPersistenceModule {}

import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { WishListPersistenceModule } from './infrastructure/wish-list-persistence.module';
import { WishListController } from './wish-list.controller';
import { WishListService } from './wish-list.service';

@Module({
  imports: [WishListPersistenceModule, ProductsModule, UsersModule],
  providers: [WishListService],
  controllers: [WishListController],
  exports: [],
})
export class WishListModule {}

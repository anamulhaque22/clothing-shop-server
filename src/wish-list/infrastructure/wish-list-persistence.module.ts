import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishListEntity } from './entities/wish-list.entity';

import { WishListReposityImpl } from './repositories/wish-list.repository.impl';
import { WishListRepository } from './wish-list.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WishListEntity])],
  providers: [
    {
      provide: WishListRepository,
      useClass: WishListReposityImpl,
    },
  ],
  exports: [WishListRepository],
})
export class WishListPersistenceModule {}

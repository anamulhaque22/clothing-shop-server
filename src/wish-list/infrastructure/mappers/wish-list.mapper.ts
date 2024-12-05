import { Product } from 'src/products/domain/product';
import { ProductEntity } from 'src/products/infrastructure/entities/product.entity';
import { User } from 'src/users/domain/user';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { WishList } from 'src/wish-list/domain/wish-list';
import { WishListEntity } from '../entities/wish-list.entity';

export class WishListMapper {
  static toDomain(raw: WishListEntity): WishList {
    const user = new User();
    if (raw.user) {
      user.id = raw.user.id;
    }

    const product = new Product();
    if (raw.product) {
      product.id = raw.product.id;
      product.title = raw.product.title;
      product.images = raw.product.images;
      product.sellPrice = raw.product.sellPrice;
    }

    const wishList = new WishList();
    wishList.id = raw.id;
    wishList.user = user;
    wishList.product = product;
    wishList.createdAt = raw.createdAt;
    wishList.updatedAt = raw.updatedAt;
    wishList.deletedAt = raw.deletedAt;

    return wishList;
  }

  static toPersistence(wishList: WishList): WishListEntity {
    const wishListEntity = new WishListEntity();

    if (wishList.id && typeof wishList.id === 'number') {
      wishListEntity.id = wishList.id;
    }
    const userEntity = new UserEntity();
    userEntity.id = wishList.user.id;

    const productEntity = new ProductEntity();
    productEntity.id = wishList.product.id;

    wishListEntity.user = userEntity;
    wishListEntity.product = productEntity;
    wishListEntity.createdAt = wishList.createdAt;
    wishListEntity.updatedAt = wishList.updatedAt;
    wishListEntity.deletedAt = wishList.deletedAt;
    return wishListEntity;
  }
}

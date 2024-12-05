import { Product } from 'src/products/domain/product';
import { User } from 'src/users/domain/user';
import { WishList } from '../domain/wish-list';

export abstract class WishListRepository {
  abstract create(data: Pick<WishList, 'user' | 'product'>): Promise<WishList>;

  abstract findOneByUserAndProduct(data: {
    productId: Product['id'];
    userId: User['id'];
  }): Promise<WishList>;

  abstract findAllByUser(userId: User['id']): Promise<WishList[]>;

  abstract remove(data: {
    id: WishList['id'];
    userId: User['id'];
  }): Promise<void>;
}

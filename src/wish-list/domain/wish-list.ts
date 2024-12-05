import { PickType } from '@nestjs/mapped-types';
import { Product } from 'src/products/domain/product';
import { User } from 'src/users/domain/user';

export class WishList extends PickType(Product, ['images', 'sellPrice']) {
  id: number;
  product: Product;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/domain/user';
import { UsersService } from 'src/users/users.service';
import { WishList } from './domain/wish-list';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { WishListRepository } from './infrastructure/wish-list.repository';

@Injectable()
export class WishListService {
  constructor(
    private readonly wishListRepo: WishListRepository,
    private readonly productService: ProductsService,
    private readonly usersService: UsersService,
  ) {}
  async create(data: CreateWishListDto & { userId: User['id'] }) {
    const product = await this.productService.findOne(data.productId);
    if (!product)
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          product: 'product does not exists',
        },
      });
    const user = await this.usersService.findById(data.userId);
    if (!user)
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'user does not exists',
        },
      });

    const wishListExists = await this.wishListRepo.findOneByUserAndProduct({
      productId: product.id,
      userId: user.id,
    });
    if (wishListExists)
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          product: `product already exists in user's wish list`,
        },
      });

    return this.wishListRepo.create({
      product,
      user,
    });
  }

  async findAll(userId: User['id']): Promise<WishList[]> {
    const user = await this.usersService.findById(userId);
    if (!user)
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'user does not exists',
        },
      });

    return this.wishListRepo.findAllByUser(user.id);
  }

  async remove(id: WishList['id'], userId: User['id']) {
    const user = await this.usersService.findById(userId);
    if (!user)
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'user does not exists',
        },
      });

    return this.wishListRepo.remove({
      id,
      userId: user.id,
    });
  }
}

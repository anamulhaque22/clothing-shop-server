import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/domain/product';
import { User } from 'src/users/domain/user';
import { WishList } from 'src/wish-list/domain/wish-list';
import { Repository } from 'typeorm';
import { WishListEntity } from '../entities/wish-list.entity';
import { WishListMapper } from '../mappers/wish-list.mapper';
import { WishListRepository } from '../wish-list.repository';

export class WishListReposityImpl implements WishListRepository {
  constructor(
    @InjectRepository(WishListEntity)
    private readonly wishListRepo: Repository<WishListEntity>,
  ) {}
  async create(data: WishList): Promise<WishList> {
    const newEntity = await this.wishListRepo.save(
      this.wishListRepo.create(WishListMapper.toPersistence(data)),
    );

    return newEntity
      ? WishListMapper.toDomain(
          await this.wishListRepo.findOne({
            where: {
              id: newEntity.id,
            },
            relations: ['product', 'product.images', 'user'],
          }),
        )
      : null;
  }

  async findOneByUserAndProduct(data: {
    productId: Product['id'];
    userId: User['id'];
  }): Promise<WishList> {
    const entity = await this.wishListRepo.findOne({
      where: {
        product: {
          id: data.productId,
        },
        user: {
          id: data.userId,
        },
      },
    });

    return entity ? WishListMapper.toDomain(entity) : null;
  }

  async findAllByUser(userId: User['id']): Promise<WishList[]> {
    const entities = await this.wishListRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['product', 'product.images', 'user'],
    });

    return entities.map((entity) => WishListMapper.toDomain(entity));
  }

  async remove(data: {
    id: WishList['id'];
    userId: User['id'];
  }): Promise<void> {
    await this.wishListRepo.delete({
      id: Number(data.id),
      user: {
        id: data.userId,
      },
    });
  }
}

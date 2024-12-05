import { ProductEntity } from "src/products/infrastructure/entities/product.entity";
import { UserEntity } from "src/users/infrastructure/entities/user.entity";
import { EntityHelper } from "src/utils/entity-helper";
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "wish_list",
})
@Unique(["user", "product"]) // Add a unique constraint
export class WishListEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.wishlist, { onDelete: "CASCADE" })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.wishlist, {
    onDelete: "CASCADE",
  })
  product: ProductEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

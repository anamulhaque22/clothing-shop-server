import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CategoryEntity } from "src/categories/infrastructure/entities/category.entity";
import { ProductSizeEntity } from "src/product-sizes/infrastructure/entities/product-size.entity";
import { ProductVisibility } from "src/products/product-visibility.enum";
import { EntityHelper } from "src/utils/entity-helper";
import { WishListEntity } from "src/wish-list/infrastructure/entities/wish-list.entity";
import { ProductColorEntity } from "./product-color.entity";
import { ProductImageEntity } from "./product-image.entity";

@Entity({
  name: "product",
})
export class ProductEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "float" })
  buyPrice: number;

  @Column({ type: "float" })
  sellPrice: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  })
  category: CategoryEntity;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  discount: number;

  @Column({ type: "enum", enum: ProductVisibility })
  visibility: ProductVisibility;

  @OneToMany(() => ProductColorEntity, (productColor) => productColor.product, {
    cascade: true,
    eager: true,
  })
  productColors: ProductColorEntity[];

  @ManyToMany(() => ProductSizeEntity, { eager: true })
  @JoinTable()
  sizes: ProductSizeEntity[];

  @OneToMany(() => ProductImageEntity, (image) => image.product, {
    eager: true,
  })
  images: ProductImageEntity[];

  // @Column({ type: 'boolean', default: false })
  // recommended: boolean;

  @OneToMany(() => WishListEntity, (wishlist) => wishlist.product, {
    eager: true,
  })
  wishlist: WishListEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

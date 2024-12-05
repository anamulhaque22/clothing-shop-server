import { ProductEntity } from "src/products/infrastructure/entities/product.entity";
import { EntityHelper } from "src/utils/entity-helper";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({
  name: "order_items",
})
export class OrderItemEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column("decimal")
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  order: OrderEntity;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column()
  colorCode: string;
}

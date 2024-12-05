import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityHelper } from 'src/utils/entity-helper';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'product_color',
})
export class ProductColorEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  colorName: string;

  @Column()
  colorCode: string;

  @ManyToOne(() => ProductEntity, (product) => product.productColors, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @Column()
  colorWiseQuantity: number;

  @Column('jsonb')
  colorSizeWiseQuantity: { [key: string]: number };
}

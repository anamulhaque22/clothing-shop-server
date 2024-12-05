import { EntityHelper } from 'src/utils/entity-helper';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'product_size',
})
export class ProductSizeEntity extends EntityHelper {
  @PrimaryColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;
}

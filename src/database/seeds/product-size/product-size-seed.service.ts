import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSizeEntity } from 'src/product-sizes/infrastructure/entities/product-size.entity';
import { ProductSizesEnum } from 'src/product-sizes/product-sizes.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ProductSizeSeedService {
  constructor(
    @InjectRepository(ProductSizeEntity)
    private repository: Repository<ProductSizeEntity>,
  ) {}
  async run() {
    const count = await this.repository.count();

    if (!count) {
      const sizeKey = Object.keys(ProductSizesEnum).filter((v) =>
        isNaN(Number(v)),
      );

      sizeKey.forEach(async (size) => {
        const value = ProductSizesEnum[size];
        await this.repository.save(
          this.repository.create({
            id: value,
            name: size.toUpperCase(),
          }),
        );
      });
    }
  }
}

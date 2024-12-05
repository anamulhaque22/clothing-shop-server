import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSizeDto } from 'src/product-sizes/dto/product-size.dto';
import { Product, ProductInfo } from 'src/products/domain/product';
import { ProductImage } from 'src/products/domain/product-image';
import { QueryCategoryDto } from 'src/products/dto/query-product.dto';
import { ProductVisibility } from 'src/products/product-visibility.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { ProductImageEntity } from '../entities/product-image.entity';
import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductRepository } from '../product.repository';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
  ) {}

  async create(data: Product): Promise<Product> {
    const persistenceModel = ProductMapper.toPersistence(data);

    const entities = await this.productRepository.save(
      this.productRepository.create(persistenceModel),
    );
    return ProductMapper.toDomain(entities);
  }

  async uploadProductImage(
    data: Omit<ProductImage, 'id'>,
  ): Promise<ProductImage> {
    const newImage = new ProductImageEntity();
    newImage.imageUrl = data.imageUrl;
    newImage.publicId = data.publicId;
    return this.productImageRepository.save(
      this.productImageRepository.create(newImage),
    );
  }

  async removeProductImage(id: ProductImage['id']): Promise<void> {
    const image = await this.productImageRepository.findOne({
      where: { id },
    });
    await this.productImageRepository.remove(image);
    return;
  }

  async findImageById(
    id: ProductImage['id'],
  ): Promise<NullableType<ProductImage>> {
    return this.productImageRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findManyWithPagination({
    // category,
    subCategory,
    search,
    paginationOptions,
    size,
    minPrice,
    maxPrice,
    visibility,
  }: {
    size: ProductSizeDto[];
    minPrice: number | null;
    maxPrice: number | null;
    search: string;
    // category: QueryCategoryDto | null;
    subCategory: QueryCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
    visibility: ProductVisibility | null;
  }): Promise<Product[]> {
    let where: FindOptionsWhere<ProductEntity> = {};

    if (subCategory) {
      where = {
        ...where,
        category: { id: In(subCategory.map((sc) => sc.id)) },
      };
    }

    if (search) {
      where.title = search;
    }

    if (size) {
      where.sizes = size.map((s) => ({ id: s.id }));
    }

    if (minPrice) {
      where.sellPrice = MoreThanOrEqual(minPrice);
    }
    if (maxPrice) {
      where.sellPrice = LessThanOrEqual(maxPrice);
    }

    if (visibility) {
      where.visibility = visibility;
    }

    const entities = await this.productRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
    });

    return entities.map((product) => ProductMapper.toDomain(product));
  }

  async findById(id: Product['id']): Promise<NullableType<Product>> {
    const entity = await this.productRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async remove(id: Product['id']): Promise<void> {
    await this.productRepository.softDelete(id);
  }

  async update(
    id: Product['id'],
    payload: Partial<Product>,
  ): Promise<Product | null> {
    const entity = await this.productRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Product Not Found!');
    }

    // checking existing product info and updating it. If not found, adding new product info
    const mappedProductInfo: ProductInfo[] = entity.productColors.map((pc) => {
      const matchingInfo = payload?.productInfo?.find((pf) => pf?.id === pc.id);
      return matchingInfo
        ? {
            ...pc,
            ...matchingInfo,
            colorSizeWiseQuantity: {
              ...pc.colorSizeWiseQuantity,
              ...matchingInfo.colorSizeWiseQuantity,
            },
          }
        : pc;
    });

    payload?.productInfo?.map((pi) => {
      if (!pi.id) {
        mappedProductInfo.push(pi);
      }
    });

    const updatedEntity = await this.productRepository.save(
      this.productRepository.create(
        ProductMapper.toPersistence({
          ...ProductMapper.toDomain(entity),
          ...payload,
          // productInfo: [...mappedProductInfo],
        }),
      ),
    );

    return ProductMapper.toDomain(updatedEntity);
  }
}

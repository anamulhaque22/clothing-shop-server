import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductSizeDto } from 'src/product-sizes/dto/product-size.dto';
import { ProductSizesEnum } from 'src/product-sizes/product-sizes.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Product } from './domain/product';
import { ProductImage } from './domain/product-image';
import { CreateProductDto } from './dto/create-product.dto';
import { ImageRemoveDto } from './dto/image-remove.dto';
import { QueryCategoryDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './infrastructure/product.repository';
import { ProductVisibility } from './product-visibility.enum';

@Injectable()
export class ProductsService {
  constructor(
    private productsRepo: ProductRepository,
    private categoriesService: CategoriesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadProductIamge(files: {
    images?: Express.Multer.File[];
  }): Promise<ProductImage[]> {
    let imageUploadedRes: CloudinaryResponse[];

    if (files.images && files?.images?.length > 0) {
      imageUploadedRes = await Promise.all(
        files.images.map((image) =>
          this.cloudinaryService.uploadFile(image, 'products'),
        ),
      );
    }

    return Promise.all(
      imageUploadedRes.map((image) => {
        return this.productsRepo.uploadProductImage({
          imageUrl: image.secure_url,
          publicId: image.public_id,
        });
      }),
    );
  }

  async removeImage(data: ImageRemoveDto[]): Promise<void> {
    await Promise.all(
      data.map(async (image) => {
        await this.productsRepo.removeProductImage(image.id);
        await this.cloudinaryService.removeFile(image.publicId);
      }),
    );

    return;
  }

  async create(payload: CreateProductDto): Promise<Product> {
    const clonedPayload = {
      ...payload,
    };
    const category = await this.categoriesService.findById(
      clonedPayload.category.id,
    );
    if (!category) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          category: `Category not found with id: ${clonedPayload.category.id}`,
        },
      });
    }

    const { sizes } = clonedPayload;
    if (sizes) {
      sizes.forEach((size) => {
        if (size.id) {
          const sizeObject = Object.values(ProductSizesEnum)
            .map(String)
            .includes(String(size.id));

          if (!sizeObject) {
            throw new UnprocessableEntityException({
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                message: 'size not exits',
              },
            });
          }
        }
      });
    }

    const validSizes = sizes.map((size) =>
      ProductSizesEnum[size.id].toLowerCase(),
    );
    clonedPayload.productInfo.forEach((info) => {
      const invalidSizes = Object.keys(info.colorSizeWiseQuantity).filter(
        (size) => !validSizes.includes(size.toLowerCase()),
      );

      if (invalidSizes.length > 0) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            message: `Invalid sizes in colorSizeWiseQuantity: ${invalidSizes.join(', ')}`,
          },
        });
      }
    });

    const { images } = clonedPayload;
    if (images) {
      images.forEach((image) => {
        if (image.id) {
          const imageObject = this.productsRepo.findImageById(image.id);

          if (!imageObject) {
            throw new UnprocessableEntityException({
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                message: 'image not exits',
              },
            });
          }
        }
      });
    }

    return await this.productsRepo.create(clonedPayload);

    // // Save product sizes
    // for (const sizeName of sizes) {
    //   let size = await this.sizesRepository.findOne({
    //     where: { sizeName: sizeName.toUpperCase() },
    //   });
    //   if (!size) {
    //     size = this.sizesRepository.create({
    //       sizeName: sizeName.toUpperCase(),
    //     });
    //     size = await this.sizesRepository.save(size);
    //   }
    //   const productSize = this.productSizesRepository.create({
    //     product: savedProduct,
    //     size,
    //   });
    //   await this.productSizesRepository.save(productSize);
    // }
    // // Save product colors and related information like color size quantity and color wise quantity
    // for (const info of productInfo) {
    //   const { color, colorWiseQuantity, colorSizeWiseQuantity, colorName } =
    //     info;
    //   const productColor = this.productColorsRepository.create({
    //     colorName: colorName.toLowerCase(),
    //     colorCode: color,
    //     product: savedProduct,
    //     colorWiseQuantity,
    //     colorSizeWiseQuantity,
    //   });

    //   await this.productColorsRepository.save(productColor);
    // }

    // for (const image of images) {
    //   const { imageUrl } = image;
    //   const newImage = this.imagesRepository.create({
    //     imageUrl,
    //     product: savedProduct,
    //   });
    //   await this.imagesRepository.save(newImage);
    // }

    // return await this.findOne(savedProduct.id);
  }

  async update(
    id: Product['id'],
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const clonedPayload = { ...updateProductDto };

    if (clonedPayload.category && clonedPayload?.category?.id) {
      const category = await this.categoriesService.findById(
        clonedPayload?.category?.id,
      );
      if (!category) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          errors: {
            category: 'Category not found!',
          },
        });
      }
    }

    if (clonedPayload?.sizes) {
      clonedPayload.sizes.forEach((size) => {
        if (size.id) {
          const sizeObject = Object.values(ProductSizesEnum)
            .map(String)
            .includes(String(size.id));

          if (!sizeObject) {
            throw new UnprocessableEntityException({
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                message: 'size not exits',
              },
            });
          }
        }
      });
    }

    if (clonedPayload?.images) {
      clonedPayload.images.forEach((image) => {
        if (image.id) {
          const imageObject = this.productsRepo.findImageById(image.id);

          if (!imageObject) {
            throw new UnprocessableEntityException({
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                message: 'image not exits',
              },
            });
          }
        }
      });
    }

    return await this.productsRepo.update(id, clonedPayload);
  }

  async findOne(id: Product['id']): Promise<NullableType<Product>> {
    return this.productsRepo.findById(id);
  }

  async findManyWithPagination({
    category,
    subCategory,
    search,
    paginationOptions,
    size,
    minPrice,
    maxPrice,
    visibility,
  }: {
    // filterOptions: FilterUserDto | null;
    // sortOptions: SortUserDto[] | null;
    size: ProductSizeDto[] | null;
    minPrice: number | null;
    maxPrice: number | null;
    search: string;
    category: QueryCategoryDto | null;
    subCategory: QueryCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
    visibility: ProductVisibility | null;
  }) {
    if (category && category.id && !subCategory && !subCategory?.length) {
      const childCategories =
        await this.categoriesService.getCategoryWithSubCategories(category.id);
      subCategory = [...childCategories, category];
    }
    return this.productsRepo.findManyWithPagination({
      subCategory,
      search,
      paginationOptions,
      size,
      minPrice,
      maxPrice,
      visibility,
    });
  }

  async delete(id: Product['id']): Promise<void> {
    return this.productsRepo.remove(id);
  }
  /*
 

  async findAll(): Promise<ProductDto[]> {
    const products = await this.productsRepository.find({
      relations: [
        'productColors',
        'productSizes',
        'productSizes.size',
        'images',
      ],
    });
    const transformedProducts = products.map((product) => {
      const transformedProduct = {
        ...product,
        sizes: product.productSizes.map((productSize) => ({
          sizeName: productSize.size.sizeName,
          id: productSize.size.id,
        })),
        productInfo: product.productColors,
      };
      delete transformedProduct.productSizes;
      delete transformedProduct.visibility;
      delete transformedProduct.productColors;
      return transformedProduct;
    });

    return transformedProducts;
  }

 
    */
}

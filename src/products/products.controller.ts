// eslint-disable-next-line prettier/prettier
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  SerializeOptions,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/roles/roles.decorators';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { InfinityPaginationResponseDto } from 'src/utils/dto/infinity-pagination-response.dto';
import { imageFileFilter } from 'src/utils/image-file-filter';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { NullableType } from 'src/utils/types/nullable.type';
import { Product } from './domain/product';
import { CreateProductDto } from './dto/create-product.dto';
import { ImageRemoveDto } from './dto/image-remove.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductVisibility } from './product-visibility.enum';
import { ProductsService } from './products.service';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('image/add')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'images',
        },
      ],
      {
        fileFilter: imageFileFilter,
      },
    ),
  )
  async uploadImage(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.productsService.uploadProductIamge(files);
  }

  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('image/delete')
  @HttpCode(HttpStatus.OK)
  async removeImage(@Body() data: ImageRemoveDto[]): Promise<void> {
    return this.productsService.removeImage(data);
  }

  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() data: CreateProductDto): Promise<Product> {
    return this.productsService.create(data);
  }

  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Body() data: UpdateProductDto,
    @Param('id') id: Product['id'],
  ) {
    return this.productsService.update(id, data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(
    @Param('id') id: Product['id'],
  ): Promise<NullableType<Product>> {
    return this.productsService.findOne(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin)
  @Get(':id/details/admin')
  @HttpCode(HttpStatus.OK)
  async findOneByIdForAdmin(
    @Param('id') id: Product['id'],
  ): Promise<NullableType<Product>> {
    return this.productsService.findOne(id);
  }
  /*
    All product list api
    1. Product will get based on category and the category will be parent cateogry. If category is not provided then it will return all products
    2. we can add pagination
    3. Search will be based on product name
    4. we can add sorting based on new and recommended
    5. we can add filter based on price range
    6. we can add sub category filter
    7. we can add size filter
  */
  @SerializeOptions({
    groups: ['user'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryProductDto,
  ): Promise<InfinityPaginationResponseDto<Product>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.productsService.findManyWithPagination({
        category: query?.category,
        subCategory: query?.subCategory,
        search: query?.search,
        maxPrice: query?.maxPrice,
        minPrice: query?.minPrice,
        size: query?.size,
        paginationOptions: {
          page,
          limit,
        },
        visibility: ProductVisibility.VISIBLE,
      }),
      { page, limit },
    );
  }

  // all product for admin
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('/all/admin')
  @HttpCode(HttpStatus.OK)
  async findAllForAdmin(
    @Query() query: QueryProductDto,
  ): Promise<InfinityPaginationResponseDto<Product>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.productsService.findManyWithPagination({
        category: query?.category,
        subCategory: query?.subCategory,
        search: query?.search,
        maxPrice: query?.maxPrice,
        minPrice: query?.minPrice,
        size: query?.size,
        paginationOptions: {
          page,
          limit,
        },
        visibility: null,
      }),
      { page, limit },
    );
  }

  @Delete('/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: Product['id']): Promise<void> {
    return this.productsService.delete(id);
  }
}

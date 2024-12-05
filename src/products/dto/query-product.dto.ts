import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductSizeDto } from 'src/product-sizes/dto/product-size.dto';

export class QueryCategoryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id?: number;
}

export class QueryProductDto {
  @IsOptional()
  @Transform(({ value }) => (value ? { id: Number(value) } : undefined))
  @Type(() => QueryCategoryDto)
  category?: QueryCategoryDto;

  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? value.split(',').map((v) =>
          plainToInstance(QueryCategoryDto, {
            id: Number(v),
          }),
        )
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => QueryCategoryDto)
  subCategory?: QueryCategoryDto[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value
      ? value.split(',').map((v) =>
          plainToInstance(ProductSizeDto, {
            id: Number(v),
          }),
        )
      : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => ProductSizeDto)
  size?: ProductSizeDto[];

  //   @IsOptional()
  //   @IsEnum(['new', 'recommended'])
  //   sortBy?: 'new' | 'recommended';

  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

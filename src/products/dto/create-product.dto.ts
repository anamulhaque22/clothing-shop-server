// create-product.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductVisibility } from '../product-visibility.enum';

class SizeDto {
  @IsNumber()
  id: number;
}

class ImageDto {
  @IsNumber()
  id: number;
}

export class ProductInfoDto {
  @IsString()
  colorName: string;

  @IsString()
  colorCode: string;

  @IsNumber()
  colorWiseQuantity: number;

  @IsObject()
  colorSizeWiseQuantity: { [key: string]: number };
}

class Category {
  @IsNumber()
  id: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  buyPrice: number;

  @IsNumber()
  sellPrice: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  discount: number;

  @IsObject()
  @Type(() => Category)
  @ValidateNested()
  category: Category;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDto)
  sizes: SizeDto[];

  @IsArray()
  @Type(() => ImageDto)
  @ValidateNested({ each: true })
  images: ImageDto[];

  @IsEnum(ProductVisibility)
  visibility: ProductVisibility;

  @IsArray()
  @Type(() => ProductInfoDto)
  @ValidateNested({ each: true })
  productInfo: ProductInfoDto[];
}

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateProductDto, ProductInfoDto } from './create-product.dto';

class UpdateProductInfoDto extends PartialType(ProductInfoDto) {
  @IsOptional()
  @IsNumber()
  id?: number;
}
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['productInfo'] as const),
) {
  @IsOptional()
  @IsArray()
  @Type(() => UpdateProductInfoDto)
  @ValidateNested({ each: true })
  productInfo?: UpdateProductInfoDto[];
}

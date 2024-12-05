import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
class ParentCategoryDto {
  @IsNumber({}, { message: 'Parent category id must be a number' })
  id: number;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => ParentCategoryDto)
  parentCategory?: ParentCategoryDto;

  @IsOptional()
  @IsBoolean()
  isVisibleInMenu?: boolean;
}

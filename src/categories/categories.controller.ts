import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/roles/roles.decorators';
import { RoleEnum } from 'src/roles/roles.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { CategoriesService } from './categories.service';
import { Category } from './domain/category';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id') id: Category['id'],
  ): Promise<NullableType<Category>> {
    return this.categoriesService.findById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id/sub-categories')
  @HttpCode(HttpStatus.OK)
  async getCategoryWithSubCategories(
    @Param('id') id: Category['id'],
  ): Promise<Category[]> {
    return this.categoriesService.getCategoryWithSubCategories(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: Category['id'],
    @Body() payload: Partial<Category>,
  ): Promise<NullableType<Category>> {
    return this.categoriesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: Category['id']): Promise<void> {
    return this.categoriesService.remove(id);
  }
}

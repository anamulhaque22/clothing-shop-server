import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NullableType } from 'src/utils/types/nullable.type';
import { Category } from './domain/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './infrastructure/category.repositoty';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    if (data.parentCategory) {
      const parentCategory = await this.categoryRepository.findById(
        data.parentCategory.id,
      );
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
      if (data.isVisibleInMenu === true) {
        throw new UnprocessableEntityException(
          "Sub category can't be visible in menu",
        );
      }
    }
    return await this.categoryRepository.create(data);
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    return this.categoryRepository.findById(id);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryWithSubCategories(id: Category['id']): Promise<Category[]> {
    if (!id) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          id: 'Category id is required',
        },
      });
    }
    return this.categoryRepository.getCategoryWithSubCategories(id);
  }

  async update(
    id: Category['id'],
    data: Partial<Category>,
  ): Promise<NullableType<Category>> {
    return this.categoryRepository.update(id, data);
  }

  async remove(id: Category['id']) {
    return this.categoryRepository.remove(id);
  }
}

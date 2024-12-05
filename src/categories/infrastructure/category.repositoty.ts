import { NullableType } from 'src/utils/types/nullable.type';
import { Category } from '../domain/category';

export abstract class CategoryRepository {
  abstract create(data: Omit<Category, 'id'>): Promise<Category>;
  abstract findAll(): Promise<Category[]>;
  abstract getCategoryWithSubCategories(
    id: Category['id'],
  ): Promise<Category[]>;
  abstract findById(id: Category['id']): Promise<NullableType<Category>>;
  abstract update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<Category | null>;
  abstract remove(id: Category['id']): Promise<void>;
}

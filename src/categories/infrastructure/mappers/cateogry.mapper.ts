import { Category } from 'src/categories/domain/category';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const category = new Category();
    category.id = raw.id;
    category.name = raw.name;
    category.isVisibleInMenu = raw.isVisibleInMenu;

    if (raw.parentCategory) {
      category.parentCategory = {
        id: raw.parentCategory.id,
      };
    }
    return category;
  }

  static toPersistence(category: Category): CategoryEntity {
    let parentCategory: CategoryEntity | undefined = undefined;
    if (category.parentCategory) {
      parentCategory = new CategoryEntity();
      parentCategory.id = category.parentCategory.id;
    }

    const categoryEntity = new CategoryEntity();

    if (category.id && typeof category.id === 'number') {
      categoryEntity.id = category.id;
    }
    categoryEntity.name = category.name;
    categoryEntity.parentCategory = parentCategory;
    categoryEntity.isVisibleInMenu = category.isVisibleInMenu;

    return categoryEntity;
  }
}

import { HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/domain/category';
import { NullableType } from 'src/utils/types/nullable.type';
import { DataSource, Equal, Repository } from 'typeorm';
import { CategoryRepository } from '../category.repositoty';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryMapper } from '../mappers/cateogry.mapper';

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private dataSource: DataSource,
  ) {}

  async create(data) {
    const toPersistence = CategoryMapper.toPersistence(data);

    return this.categoryRepository.save(
      this.categoryRepository.create(toPersistence),
    );
  }

  async getCategoryWithSubCategories(id: Category['id']): Promise<Category[]> {
    if (!id) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          message: 'Category not found',
        },
      });
    }
    // const category = await this.categoryRepository.find({
    //   where: { parentCategory: Equal(Number(id)) },
    // });

    const category = await this.dataSource.query(
      `
      WITH RECURSIVE all_categories AS (
        SELECT id, name, "parentCategoryId"
        FROM categories
        WHERE id = $1

        UNION ALL

        SELECT t.id, t.name, t."parentCategoryId"
        FROM categories t
        INNER JOIN all_categories d ON t."parentCategoryId" = d.id
    )
    SELECT * FROM all_categories;`,
      [id],
    );

    return category.map((category) => CategoryMapper.toDomain(category));
  }

  async findAll(): Promise<Category[]> {
    // const categories = await this.categoryRepository.find({
    //   relations: ['parentCategory'],
    // });

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      // .innerJoinAndSelect('category.products', 'product')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .getMany();
    return categories.map((category) => CategoryMapper.toDomain(category));
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: Equal(id),
      },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<NullableType<Category>> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          message: 'Category not found',
        },
      });
    }
    Object.assign(category, payload);
    return this.categoryRepository.save(
      this.categoryRepository.create(category),
    );
  }
  async remove(id: Category['id']): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}

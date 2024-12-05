import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial } from 'typeorm';
import { User } from '../domain/user';
import { FilterUserDto, SortUserDto } from '../dto/query-user.dto';

export interface IUserRepository {
  create(data: Omit<User, 'id' | 'deletedAt' | 'updatedAt'>): Promise<User>;

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions: FilterUserDto | null;
    sortOptions: SortUserDto;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;

  findById(id: User['id']): Promise<NullableType<User>>;

  findByEmail(email: User['email']): Promise<NullableType<User>>;

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>>;

  update(id: User['id'], payload: DeepPartial<User>): Promise<User | null>;
  remove(id: User['id']): Promise<void>;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserImage } from 'src/users/domain/user';
import { FilterUserDto, SortUserDto } from 'src/users/dto/query-user.dto';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserImageEntity } from '../entities/user-image.entity';
import { UserMapper } from '../mappers/user.mapper';
import { IUserRepository } from '../user.repository.interface';

@Injectable()
export class UsersRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserImageEntity)
    private readonly userImagesRepository: Repository<UserImageEntity>,
  ) {}

  async uploadUserImage(
    data: Omit<UserImage, 'id'> & {
      publicId: string;
    },
  ): Promise<UserImage> {
    const newImage = new UserImageEntity();
    newImage.url = data.url;
    newImage.publicId = data.publicId;
    return this.userImagesRepository.save(
      this.userImagesRepository.create(newImage),
    );
  }

  async removeUserImage(
    id: UserImage['id'],
  ): Promise<UserImageEntity['publicId']> {
    const image = await this.userImagesRepository.findOne({ where: { id } });
    await this.userImagesRepository.remove(image);
    return image.publicId;
  }

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) {
      return null;
    }
    const entity = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { socialId, provider },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const where: FindOptionsWhere<UserEntity> = {};
    if (filterOptions?.roles?.length) {
      where.role = filterOptions.roles.map((role) => ({
        id: role.id,
      }));
    }

    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User | null> {
    const entity = await this.usersRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!entity) {
      throw new NotFoundException("User doesn't exist");
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );
    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}

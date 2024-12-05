import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressType } from 'src/addresses/address-type.enum';
import { Address } from 'src/addresses/domain/address';
import { User } from 'src/users/domain/user';
import { NullableType } from 'src/utils/types/nullable.type';
import { Repository } from 'typeorm';
import { AddressRepository } from '../address.repository';
import { AddressEntity } from '../entities/address.entity';
import { AddressMapper } from '../mapper/address.mapper';

@Injectable()
export class AddressRepositoryImpl implements AddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async create(
    data: Address & {
      id: User['id'] | null;
    },
  ): Promise<Address> {
    const persistenceModel = AddressMapper.toPersistence(data);
    let entities;

    entities = await this.addressRepository.save(
      this.addressRepository.create({
        ...persistenceModel,
        addressType: data.addressType || AddressType.HOME,
        user: { id: data.id },
      }),
    );

    return AddressMapper.toDomain(entities);
  }

  async findAll(): Promise<Address[]> {
    const entities = await this.addressRepository.find({
      withDeleted: false,
      where: { isOrderAddress: false },
    });
    return entities.map((entity) => AddressMapper.toDomain(entity));
  }

  async findByUserId(userId: User['id']): Promise<Address[]> {
    const entities = await this.addressRepository.find({
      where: { user: { id: userId } },
    });

    return entities.map((entity) => AddressMapper.toDomain(entity));
  }

  async findById(id: Address['id']): Promise<NullableType<Address>> {
    const entity = await this.addressRepository.findOne({ where: { id } });

    return entity ? AddressMapper.toDomain(entity) : null;
  }

  async update(
    id: Address['id'],
    payload: Partial<Address>,
  ): Promise<Address | null> {
    const entity = await this.addressRepository.findOne({ where: { id } });

    if (!entity) {
      return null;
    }

    const persistenceModel = AddressMapper.toPersistence({
      ...AddressMapper.toDomain(entity),
      ...payload,
    });

    const updatedEntity = await this.addressRepository.save(
      this.addressRepository.create(persistenceModel),
    );

    return AddressMapper.toDomain(updatedEntity);
  }

  async deleteById(id: Address['id']): Promise<void> {
    await this.addressRepository.softDelete({
      id: id,
    });
  }
}

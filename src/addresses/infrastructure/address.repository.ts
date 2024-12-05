import { User } from 'src/users/domain/user';
import { NullableType } from 'src/utils/types/nullable.type';
import { Address } from '../domain/address';

export abstract class AddressRepository {
  abstract create(
    data: Omit<Address, 'id'> & {
      id?: User['id'] | null;
    },
  ): Promise<Address>;

  abstract findAll(): Promise<Address[]>;

  abstract findByUserId(userId: User['id']): Promise<Address[]>;

  abstract findById(id: Address['id']): Promise<NullableType<Address>>;

  abstract update(
    id: Address['id'],
    payload: Partial<Omit<Address, 'id'>>,
  ): Promise<Address | null>;

  abstract deleteById(id: Address['id']): Promise<void>;
}

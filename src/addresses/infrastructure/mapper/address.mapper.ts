import { AddressType } from 'src/addresses/address-type.enum';
import { Address } from 'src/addresses/domain/address';
import { AddressEntity } from '../entities/address.entity';

export class AddressMapper {
  static toDomain(raw: AddressEntity): Address {
    const address = new Address();
    address.id = raw.id;
    address.firstName = raw.firstName;
    address.lastName = raw.lastName;
    address.streetAddress = raw.streetAddress;
    address.aptSuiteUnit = raw.aptSuiteUnit;
    address.city = raw.city;
    address.phone = raw.phone;
    address.addressType = raw.addressType;
    address.isDefaultShipping = raw.isDefaultShipping;
    address.isDefaultBilling = raw.isDefaultBilling;
    return address;
  }

  static toPersistence(domain: Address): AddressEntity {
    const addressEntity = new AddressEntity();

    if (domain.addressType) {
      addressEntity.addressType = domain.addressType;
    } else {
      addressEntity.addressType = AddressType.HOME;
    }

    addressEntity.id = domain.id;
    addressEntity.id = domain.id;
    addressEntity.isDefaultBilling = domain.isDefaultBilling;
    addressEntity.isDefaultShipping = domain.isDefaultShipping;
    addressEntity.firstName = domain.firstName;
    addressEntity.lastName = domain.lastName;
    addressEntity.streetAddress = domain.streetAddress;
    addressEntity.aptSuiteUnit = domain.aptSuiteUnit;
    addressEntity.city = domain.city;
    addressEntity.phone = domain.phone;
    addressEntity.isOrderAddress = domain.isOrderAddress || false;
    return addressEntity;
  }
}

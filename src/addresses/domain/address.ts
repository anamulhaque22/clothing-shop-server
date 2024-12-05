import { AddressType } from '../address-type.enum';

export class Address {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  streetAddress: string;
  aptSuiteUnit?: string | null;
  city: string;
  phone: string;
  addressType: AddressType;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  isOrderAddress?: boolean;
}

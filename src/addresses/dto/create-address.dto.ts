import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AddressType } from '../address-type.enum';

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  streetAddress: string;

  @IsOptional()
  @IsString()
  aptSuiteUnit?: string;

  @IsOptional()
  @IsEnum(AddressType)
  addressType: AddressType;

  @IsString()
  city: string;

  @IsString()
  phone: string;

  @IsBoolean()
  isDefaultShipping: boolean;

  @IsBoolean()
  isDefaultBilling: boolean;

  @IsBoolean()
  @IsOptional()
  isOrderAddress: boolean;
}

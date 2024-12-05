import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleDto } from 'src/roles/dto/role.dto';
import { StatusDto } from 'src/statuses/dto/status.dto';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class UserImageDto {
  @IsString()
  id: string;

  url: string;
}

export class CreateUserDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string | null;

  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  photo?: UserImageDto | null;

  @IsOptional()
  @Type(() => RoleDto)
  role: RoleDto | null;

  @IsOptional()
  @Type(() => StatusDto)
  status: StatusDto | null;

  hash?: string | null;
}

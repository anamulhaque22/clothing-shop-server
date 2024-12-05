import { IsNotEmpty } from 'class-validator';

export class AuthResetPasswordDto {
  // @Min(6)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  hash: string;
}

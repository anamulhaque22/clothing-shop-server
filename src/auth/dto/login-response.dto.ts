import { User } from 'src/users/domain/user';

export class LoginResponseDto {
  token: string;

  refreshToken: string;

  tokenExpires: number;

  user: User;
}

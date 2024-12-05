import { Exclude, Expose } from 'class-transformer';
import { Allow } from 'class-validator';
import { Role } from 'src/roles/domain/role';
import { Status } from 'src/statuses/domain/status';

export class UserImage {
  @Allow()
  id: string;

  @Allow()
  url: string;
}

export class User {
  id: number;

  @Expose({ groups: ['me', 'admin'] })
  email: string;

  @Expose({ groups: ['me', 'admin'] })
  phone: string;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  firstName: string | null;

  lastName: string | null;

  photo?: UserImage | null;

  role?: Role | null;

  status?: Status;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

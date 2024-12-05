import { RoleEntity } from 'src/roles/infrastructure/entities/role.entity';
import { StatusEntity } from 'src/statuses/infrastructure/entities/status.entity';
import { User, UserImage } from 'src/users/domain/user';
import { UserImageEntity } from '../entities/user-image.entity';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.phone = raw.phone;
    user.password = raw.password;
    user.previousPassword = raw.previousPassword;
    user.provider = raw.provider;
    user.socialId = raw.socialId;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;

    if (raw.photo) {
      const userImage: UserImage = new UserImage();
      userImage.id = raw.photo.id;
      userImage.url = raw.photo.url;
      user.photo = userImage;
    }

    user.photo = raw.photo;
    user.role = raw.role;
    user.status = raw.status;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.deletedAt = raw.deletedAt;
    return user;
  }

  static toPersistence(user: User): UserEntity {
    let role: RoleEntity | undefined = undefined;
    if (user.role) {
      role = new RoleEntity();
      role.id = Number(user.role.id);
    }

    let status: StatusEntity | undefined = undefined;
    if (user.status) {
      status = new StatusEntity();
      status.id = Number(user.status.id);
    }

    let photo: UserImageEntity | undefined = undefined;
    if (user.photo) {
      photo = new UserImageEntity();
      photo.id = user.photo.id;
      photo.url = user.photo.url;
    }

    const userEntity = new UserEntity();
    if (user.id && typeof user.id === 'number') {
      userEntity.id = user.id;
    }
    userEntity.email = user.email;
    userEntity.phone = user.phone;
    userEntity.password = user.password;
    userEntity.previousPassword = user.previousPassword;
    userEntity.provider = user.provider;
    userEntity.socialId = user.socialId;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = status;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.deletedAt = user.deletedAt;
    return userEntity;
  }
}

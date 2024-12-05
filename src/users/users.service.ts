import {
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthProvidersEnum } from 'src/auth/auth-provider.enum';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Role } from 'src/roles/domain/role';
import { RoleEnum } from 'src/roles/roles.enum';
import { Status } from 'src/statuses/domain/status';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User, UserImage } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  IUserRepository,
  USERS_REPOSITORY_TOKEN,
} from './infrastructure/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: IUserRepository,

    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadUserImage(files: Express.Multer.File): Promise<UserImage> {
    let imageUploadedRes: CloudinaryResponse;
    if (files) {
      imageUploadedRes = await this.cloudinaryService.uploadFile(
        files,
        'users',
      );
    }

    return this.usersRepository.uploadUserImage({
      url: imageUploadedRes.secure_url,
      publicId: imageUploadedRes.public_id,
    });
  }

  async removeImage(id: UserImage['id']): Promise<void> {
    const result = await this.usersRepository.removeUserImage(id);
    await this.cloudinaryService.removeFile(result);
    return;
  }

  async create(createProfileDto: CreateUserDto): Promise<User> {
    // return type Promise<User>
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    if (clonedPayload.password) {
      const solt = await bcrypt.genSalt(10);
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, solt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByEmail(
        clonedPayload.email,
      );

      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'Email already exists',
          },
        });
      }
    }

    // letter will develop generic file upload system
    if (clonedPayload.photo?.id) {
      // const fileObject = await this.findImage.findById(clonedPayload.photo.id);
      // if (!fileObject) {
      //   throw new UnprocessableEntityException({
      //     status: HttpStatus.UNPROCESSABLE_ENTITY,
      //     errors: {
      //       photo: 'imageNotExists',
      //     },
      //   });
      // }
      clonedPayload.photo = {
        id: clonedPayload.photo.id,
        url: clonedPayload.photo.url,
      };
    } else {
      clonedPayload.photo = null;
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(clonedPayload.role.id));

      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'role not exits',
          },
        });
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(clonedPayload.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'status not exits',
          },
        });
      }
    }

    return this.usersRepository.create(clonedPayload);
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    return this.usersRepository.findBySocialIdAndProvider({
      socialId,
      provider,
    });
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let photo: UserImage | null | undefined = undefined;

    if (updateUserDto.photo?.id) {
      // const fileObject = await this.findImage.findById(
      //   updateUserDto.photo.id,
      // );
      // if (!fileObject) {
      //   throw new UnprocessableEntityException({
      //     status: HttpStatus.UNPROCESSABLE_ENTITY,
      //     errors: {
      //       photo: 'imageNotExists',
      //     },
      //   });
      // }
      photo = {
        id: updateUserDto.photo.id,
        url: updateUserDto.photo.url,
      };
    } else if (updateUserDto.photo === null) {
      photo = null;
    }

    let role: Role | undefined = undefined;

    if (updateUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = {
        id: updateUserDto.role.id,
      };
    }

    let status: Status | undefined = undefined;

    if (updateUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = {
        id: updateUserDto.status.id,
      };
    }

    return this.usersRepository.update(id, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      photo,
      role,
      status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
      phone: updateUserDto.phone,
    });
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }
}

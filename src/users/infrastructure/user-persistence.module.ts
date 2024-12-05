import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

import { UserImageEntity } from './entities/user-image.entity';
import { UsersRepositoryImpl } from './repositories/users.repository.impl';
import { USERS_REPOSITORY_TOKEN } from './user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserImageEntity])],
  providers: [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersRepositoryImpl,
    },
  ],
  exports: [USERS_REPOSITORY_TOKEN],
})
export class UserPersistenceModule {}

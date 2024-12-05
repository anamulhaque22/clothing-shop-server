import { Module } from '@nestjs/common';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserPersistenceModule } from './infrastructure/user-persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserPersistenceModule, CloudinaryModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

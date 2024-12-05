import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { UsersSeedService } from './users-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersSeedService],
  exports: [UsersSeedService],
})
export class UsersSeedModule {}

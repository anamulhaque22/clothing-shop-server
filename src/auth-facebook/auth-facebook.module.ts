import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthFacebookService } from './auth-facebook.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthFacebookController],
  providers: [AuthFacebookService],
  exports: [],
})
export class AuthFacebookModule {}

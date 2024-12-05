import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
  providers: [AuthGoogleService],
})
export class AuthGoogleModule {}

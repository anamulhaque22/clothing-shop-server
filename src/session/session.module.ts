import { Module } from '@nestjs/common';
import { SessionTypeormModule } from './infrastructure/session.typeorm.module';
import { SessionService } from './session.service';

@Module({
  imports: [SessionTypeormModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

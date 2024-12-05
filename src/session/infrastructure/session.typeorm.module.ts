import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionRepositoryImpl } from './repositories/session.repository.impl';
import { SessionRepository } from './session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionRepositoryImpl,
    },
  ],
  exports: [SessionRepository],
})
export class SessionTypeormModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from './address.repository';
import { AddressEntity } from './entities/address.entity';
import { AddressRepositoryImpl } from './repositories/address.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [
    {
      provide: AddressRepository,
      useClass: AddressRepositoryImpl,
    },
  ],
  exports: [AddressRepository],
})
export class AddressTypeOrmModule {}

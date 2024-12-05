import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from '../config/database.config';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { ProductSizeSeedModule } from './product-size/product-size-seed.module';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UsersSeedModule } from './users/users-seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    RoleSeedModule,
    StatusSeedModule,
    ProductSizeSeedModule,
    UsersSeedModule,
  ],
})
export class SeedModule {}

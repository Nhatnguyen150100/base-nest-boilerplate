import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '@/config';
import { User } from '@/modules/auth/entities';

/**
 * @todo Add more entities to the listEntitiesImported array as needed.
 * This module is responsible for setting up the database connection and importing
 */
const listEntitiesImported = [User];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (appConfig: AppConfig) => {
        const config = appConfig.typeOrmConfig;
        if (!config) {
          throw new Error('TypeORM configuration is not defined');
        }
        return config;
      },
    }),
    TypeOrmModule.forFeature(listEntitiesImported),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

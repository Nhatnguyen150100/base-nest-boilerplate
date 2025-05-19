import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '../../config/app.config';
import { DynamicModule } from '@nestjs/common';

const databaseModule: DynamicModule | Promise<DynamicModule> =
  TypeOrmModule.forRootAsync({
    inject: [AppConfig],
    useFactory: (appConfig: AppConfig) => {
      const config = appConfig.typeOrmConfig;
      if (!config) {
        throw new Error('TypeORM configuration is not defined');
      }
      return config;
    },
  });

export default databaseModule;

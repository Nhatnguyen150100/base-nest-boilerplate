import { ConfigService, registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppConfig } from './app.config';
import { Logger } from '@nestjs/common';

dotenv.config();

const config = new AppConfig(new ConfigService()).typeOrmConfigDataSource;

export default registerAs('typeormConfig', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

connectionSource
  .initialize()
  .then(() => {
    Logger.log('Data Source has been initialized!', 'DataSource');
  })
  .catch((err) => {
    Logger.error('Error during Data Source initialization', err);
  });

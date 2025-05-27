import { ConfigService, registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppConfig } from './app.config';
import { Logger } from '@nestjs/common';

dotenv.config();

const config = new AppConfig(new ConfigService()).typeOrmConfigDataSource;

export const typeormConfig = registerAs('typeormConfig', () => config);
const AppDataSource = new DataSource(config as DataSourceOptions);
export default AppDataSource;

AppDataSource.initialize()
  .then(() => {
    Logger.log('Data Source has been initialized!', 'DataSource');
  })
  .catch((err) => {
    Logger.error('Error during Data Source initialization', err);
  });

// src/config/typeorm.config.ts
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppConfig } from './app.config';

dotenv.config();

const configService = new ConfigService();
const config = new AppConfig(configService).typeOrmConfigDataSource;
console.log('🚀 ~ config:', config.seeds);

const AppDataSource = new DataSource(config as DataSourceOptions);

export default AppDataSource;

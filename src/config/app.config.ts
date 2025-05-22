import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { SnakeNamingStrategy } from '../snake-naming.strategy';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SeederOptions } from 'typeorm-extension';

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get generalConfig() {
    return {
      port: this.getString('PORT'),
      serverUrl: this.getString('BASE_SERVER_URL'),
      clientUrl: this.getString('BASE_CLIENT_URL'),
      apiPrefix: this.getString('API_PREFIX'),
    };
  }

  get oAuth2Config() {
    return {
      clientId: this.getString('GOOGLE_CLIENT_ID'),
      clientSecret: this.getString('GOOGLE_CLIENT_SECRET'),
      redirectUrl: this.getString('GOOGLE_REDIRECT_URL'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getString('JWT_EXPIRATION_TIME'),
    };
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return this.get('typeormConfig') as TypeOrmModuleOptions;
  }

  get typeOrmConfigDataSource(): DataSourceOptions {
    const entities = [
      join(__dirname, '../modules/**/*.entity{.ts,.js}'),
      join(__dirname, '../modules/**/*.view-entity{.ts,.js}'),
    ];
    const migrations = [join(__dirname, '../database/migrations/*{.ts,.js}')];
    const seeds = [join(__dirname, '../database/seeds/*{.ts,.js}')];

    const _config: DataSourceOptions & SeederOptions = {
      entities,
      migrations,
      seeds,
      dropSchema: this.isTest,
      type: this.getString('DB_TYPE') as 'mysql' | 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      migrationsRun: this.isDevelopment,
      synchronize: this.isDevelopment,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };

    if (!(this.getString('DB_HOST') && this.getNumber('DB_PORT'))) {
      Logger.error('Database configuration is incomplete:', _config);
    }

    return _config;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace('\\n', '\n');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (value == null) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }
}

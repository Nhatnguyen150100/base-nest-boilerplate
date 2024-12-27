import { AppConfig } from './config/app.config';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/module/shared.module';
import typeormConfig from './config/typeorm.config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/authGuard';
import { RoleGuard } from './guards/rolesGuard';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';
dotenv.config();

const coreModule: (DynamicModule | Promise<DynamicModule>)[] = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [typeormConfig],
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const appConfig = new AppConfig(configService);
      const config = appConfig.typeOrmConfig;
      if (!config) {
        throw new Error('TypeORM configuration is not defined');
      }
      return config;
    },
  }),
];

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
  ],
  imports: [AuthModule, SharedModule, ...coreModule],
})
export class AppModule {}

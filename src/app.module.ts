import { AppConfig } from './config/app.config';
import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/module/shared.module';
import typeormConfig from './config/typeorm.config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/authGuard';
import { RoleGuard } from './guards/rolesGuard';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';
import { UnauthorizedExceptionFilter } from './filters/unauthorized.filter';
import { UploadModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CsrfMiddleware } from './middlewares/csrf.middleware';
dotenv.config();

const coreModule: (DynamicModule | Promise<DynamicModule>)[] = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [typeormConfig],
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    serveRoot: '/images',
  }),
];

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

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
  ],
  imports: [
    ...coreModule,
    databaseModule,
    SharedModule,
    AuthModule,
    UploadModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}

import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/module/shared.module';
import { UploadModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { ExceptionModule } from './modules/exception/exception.module';
import { CsrfMiddleware } from './middlewares';
import typeormConfig from './config/typeorm.config';
import databaseModule from './modules/database/database.module';
import { GuardModule } from './modules/guard/Guard.module';
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

@Module({
  imports: [
    ...coreModule,
    databaseModule,
    SharedModule,
    AuthModule,
    UploadModule,
    HealthModule,
    ExceptionModule,
    GuardModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}

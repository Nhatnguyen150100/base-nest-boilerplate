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
import { ExceptionModule } from './modules/exception/exception.module';
import { CsrfMiddleware } from './middlewares';
import { typeormConfig } from './config/typeorm.config';
import { GuardModule } from './modules/guard/guard.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './loggers/winston.logger';
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

const loggerModule = WinstonModule.forRoot(winstonLoggerOptions);

@Module({
  imports: [
    ...coreModule,
    loggerModule,
    SharedModule,
    DatabaseModule,
    AuthModule,
    UploadModule,
    HealthModule,
    ExceptionModule,
    GuardModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CsrfMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.ALL })
      .apply(RequestLoggerMiddleware)
      .forRoutes('{*splat}');
  }
}

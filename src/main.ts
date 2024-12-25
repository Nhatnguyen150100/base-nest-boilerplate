import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { SharedModule } from './shared/module/shared.module';
import { AppConfig } from './config/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import morgan = require('morgan');
import { setupSwagger } from './setup-swagger';

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.enable('trust proxy');
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    exposedHeaders: ['X-Total-Count', 'token'],
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );
  const configService = app.select(SharedModule).get(AppConfig);
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }
  if (configService.documentationEnabled) {
    setupSwagger(app, configService.appConfig.port);
  }
  await app.listen(configService.appConfig.port);
  Logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');
  return app;
}

void bootstrap();

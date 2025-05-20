import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { SharedModule } from './shared/module/shared.module';
import { AppConfig } from './config/app.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { setupSwagger } from './setup-swagger';
import { join } from 'path';

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.select(SharedModule).get(AppConfig);
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enable('trust proxy');
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();
  app.enableCors({
    origin: [configService.generalConfig.clientUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    exposedHeaders: ['X-Total-Count', 'token'],
  });
  app.setGlobalPrefix(configService.generalConfig.apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new UnprocessableEntityException({
          message: formattedErrors,
          error: 'Validation Error',
        });
      },
    }),
  );
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }
  if (configService.documentationEnabled) {
    setupSwagger(app, configService.generalConfig.port);
  }
  await app.listen(configService.generalConfig.port);
  Logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');
  return app;
}

void bootstrap();

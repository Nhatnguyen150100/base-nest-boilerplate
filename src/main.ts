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
import morgan = require('morgan');
import { setupSwagger } from './setup-swagger';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';
import { UnauthorizedExceptionFilter } from './filters/unauthorized.filter';
import { UnprocessableEntityFilter } from './filters/unprocessable-entity.filter';
import { InternalServerErrorFilter } from './filters/internal-server-error.filter';
import { join } from 'path';
import {
  doubleCsrf,
  CsrfRequestMethod,
  DoubleCsrfConfigOptions,
} from 'csrf-csrf';
import { Request } from 'express';

const doubleCsrfOptions: DoubleCsrfConfigOptions = {
  getSecret: (): string => 'your-secret-key',
  getSessionIdentifier: (req: Request): string => {
    return req.ip || 'anonymous';
  },
  cookieName: 'x-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'] as CsrfRequestMethod[],
  getCsrfTokenFromRequest: (req: Request): string =>
    req.headers['x-csrf-token'] as string,
};

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.select(SharedModule).get(AppConfig);
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new UnprocessableEntityFilter(),
    new InternalServerErrorFilter(),
  );
  app.enable('trust proxy');
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();
  app.enableCors({
    origin: [configService.appConfig.clientUrl],
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
  const { doubleCsrfProtection, generateCsrfToken } =
    doubleCsrf(doubleCsrfOptions);
  app.use(doubleCsrfProtection);
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

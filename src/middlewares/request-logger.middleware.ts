import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getResponseObject } from '@/helpers';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.ip || req.socket.remoteAddress;

    res.on('finish', () => {
      const { statusCode } = res;
      if (
        statusCode ===
        getResponseObject(HttpStatus.OK || HttpStatus.CREATED).statusCode
      ) {
        this.logger.info(`[${method}] ${originalUrl} [${statusCode}] - ${ip}`);
      } else {
        this.logger.error(
          `[${method}] ${originalUrl} [${statusCode}] - ${ip}`,
          {
            statusCode,
            method,
            url: originalUrl,
            ip,
          },
        );
      }
    });

    next();
  }
}

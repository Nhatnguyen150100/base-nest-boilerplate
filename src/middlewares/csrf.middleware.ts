import {
  CsrfRequestMethod,
  doubleCsrf,
  DoubleCsrfConfigOptions,
} from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

const doubleCsrfOptions: DoubleCsrfConfigOptions = {
  getSecret: (): string => process.env.CSRF_SECRET || 'your-secret-key',
  getSessionIdentifier: (req: Request): string => req.ip || 'anonymous',
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
    (req.headers['x-csrf-token'] as string) ||
    (req.body && req.body._csrf) ||
    (req.query && req.query._csrf),
};

const { doubleCsrfProtection, generateCsrfToken } =
  doubleCsrf(doubleCsrfOptions);

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toUpperCase();

    if (method === 'OPTIONS') {
      return next();
    }

    if (['GET', 'HEAD'].includes(method)) {
      generateCsrfToken(req, res);
      res.setHeader('X-CSRF-Token', req.csrfToken?.());
      return next();
    }

    return doubleCsrfProtection(req, res, next);
  }
}

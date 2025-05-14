import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseErrorResponse } from '../config/response.config';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as BaseErrorResponse;
    Logger.error(
      `Caught UnauthorizedException: ${exceptionResponse.message}`,
      'UnauthorizedException',
    );

    response
      .status(status)
      .json({ ...exceptionResponse, timeStamp: new Date().toISOString() });
  }
}

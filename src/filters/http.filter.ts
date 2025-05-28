import { BaseErrorResponse } from '@/config';
import { getResponseObject } from '@/helpers';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    let message = 'Unexpected error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse &&
      'message' in exceptionResponse
    ) {
      const msg = (exceptionResponse as any).message;
      message = Array.isArray(msg) ? msg.join(', ') : msg;
    } else {
      message = getResponseObject(status).message;
    }

    Logger.error(
      `[${exception.name}] ${message}`,
      exception.stack,
      'HttpExceptionFilter',
    );

    const errorObj = new BaseErrorResponse({
      message,
      statusCode: status,
    });

    response.status(status).json(errorObj);
  }
}

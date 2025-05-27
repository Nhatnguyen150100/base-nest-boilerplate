import { BaseErrorResponse } from '@/config';
import { getResponseObject } from '@/helpers';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class NonHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = getResponseObject(
      HttpStatus.INTERNAL_SERVER_ERROR,
    ).statusCode;

    Logger.error(
      `[UnhandledException] ${exception.message}`,
      exception.stack,
      'NonHttpExceptionFilter',
    );

    const errorObj = new BaseErrorResponse({
      message: 'Internal server error',
      statusCode: status,
    });
    console.log('🚀 ~ NonHttpExceptionFilter ~ errorObj:', errorObj);

    response.status(status).json(errorObj);
  }
}

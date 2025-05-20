import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseErrorResponse } from '../config/response.config';
import { getResponseObject } from '../helpers';

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

    response.status(status).json(errorObj);
  }
}

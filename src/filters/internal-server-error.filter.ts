import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseErrorResponse } from '../config/response.config';

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;
    const message = exception.message;

    Logger.error(
      `Caught InternalServerErrorException: ${message}`,
      'InternalServerErrorException',
    );

    const errorObj = new BaseErrorResponse({
      message,
      statusCode: status,
    });

    response.status(status).json({ ...errorObj });
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseErrorResponse } from '../config/response.config';
import { Response } from 'express';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    Logger.error(
      `Caught UnprocessableEntityException: ${exceptionResponse.message}`,
      'UnprocessableEntityException',
    );

    const errorObj = new BaseErrorResponse({
      message: exceptionResponse.message,
      statusCode: status,
    });

    response.status(status).json(errorObj);
  }
}

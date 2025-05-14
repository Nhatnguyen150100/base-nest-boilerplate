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
    const exceptionResponse = exception.getResponse() as BaseErrorResponse;
    Logger.error(
      `Caught UnprocessableEntityException: ${exceptionResponse.message}`,
      'UnprocessableEntityException',
    );

    response
      .status(status)
      .json({
        ...exceptionResponse,
        statusCode: status,
        timeStamp: new Date().toISOString(),
      });
  }
}

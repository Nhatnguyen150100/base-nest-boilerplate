import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseErrorResponse } from '../config/response.config';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const objError = exception.getResponse() as BaseErrorResponse;
    Logger.error(`Caught BadRequestException: ${objError.message}`);

    response.status(status).json(objError);
  }
}

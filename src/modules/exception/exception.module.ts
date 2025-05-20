import { Module, Global } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  HttpExceptionFilter,
  NonHttpExceptionFilter,
  UnprocessableEntityFilter,
} from '../../filters';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: NonHttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnprocessableEntityFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ExceptionModule {}

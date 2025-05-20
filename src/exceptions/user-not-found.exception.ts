import { BaseErrorResponse } from '@/config';
import { getResponseObject } from '@/helpers';
import { HttpStatus, Logger, NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    Logger.error('User not found');
    super(
      new BaseErrorResponse({
        statusCode: getResponseObject(HttpStatus.NOT_FOUND).statusCode,
        message: error || 'User not found. Please try again',
      }),
      error,
    );
  }
}

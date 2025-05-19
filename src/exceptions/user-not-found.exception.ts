import { HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { BaseErrorResponse, DEFINE_STATUS_RESPONSE } from '../config';

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    Logger.error('User not found');
    super(
      new BaseErrorResponse({
        statusCode: DEFINE_STATUS_RESPONSE[HttpStatus.NOT_FOUND].statusCode,
        message: error || 'User not found. Please try again',
      }),
      error,
    );
  }
}

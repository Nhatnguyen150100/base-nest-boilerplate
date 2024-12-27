import { Logger, NotFoundException } from '@nestjs/common';
import { BaseErrorResponse } from '../config/response.config';
import { DEFINE_STATUS_RESPONSE } from '../config/statusResponse.config';

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    Logger.error('User not found');
    super(
      new BaseErrorResponse({
        statusCode: DEFINE_STATUS_RESPONSE.NOT_FOUND.statusCode,
        message: error || 'User not found. Please try again',
      }),
      error,
    );
  }
}

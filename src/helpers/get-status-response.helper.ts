import { DEFINE_STATUS_RESPONSE } from '@/config';
import { HttpStatus } from '@nestjs/common';

export function getResponseObject(statusCode: number): {
  statusCode: number;
  message: string;
} {
  const response = DEFINE_STATUS_RESPONSE[statusCode];

  if (response) {
    return response;
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
  };
}

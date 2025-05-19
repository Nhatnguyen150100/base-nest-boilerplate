import { HttpStatus } from '@nestjs/common';

const DEFINE_STATUS_RESPONSE: Record<
  number,
  { statusCode: number; message: string }
> = {
  [HttpStatus.OK]: {
    statusCode: HttpStatus.OK,
    message: 'Success',
  },
  [HttpStatus.BAD_REQUEST]: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Bad Request',
  },
  [HttpStatus.NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Not Found',
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
  },
  [HttpStatus.UNAUTHORIZED]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: 'Unauthorized',
  },
  [HttpStatus.FORBIDDEN]: {
    statusCode: HttpStatus.FORBIDDEN,
    message: 'Forbidden',
  },
  [HttpStatus.UNPROCESSABLE_ENTITY]: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Validation failed',
  },
  [HttpStatus.CONFLICT]: {
    statusCode: HttpStatus.CONFLICT,
    message: 'Conflict',
  },
  [HttpStatus.GONE]: {
    statusCode: HttpStatus.GONE,
    message: 'Gone',
  },
  [HttpStatus.PRECONDITION_FAILED]: {
    statusCode: HttpStatus.PRECONDITION_FAILED,
    message: 'Precondition Failed',
  },
  [HttpStatus.TOO_MANY_REQUESTS]: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message: 'Too Many Requests',
  },
  [HttpStatus.SERVICE_UNAVAILABLE]: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    message: 'Service Unavailable',
  },
  [HttpStatus.REQUEST_TIMEOUT]: {
    statusCode: HttpStatus.REQUEST_TIMEOUT,
    message: 'Request Timeout',
  },
  [HttpStatus.NOT_IMPLEMENTED]: {
    statusCode: HttpStatus.NOT_IMPLEMENTED,
    message: 'Not Implemented',
  },
  [HttpStatus.BAD_GATEWAY]: {
    statusCode: HttpStatus.BAD_GATEWAY,
    message: 'Bad Gateway',
  },
  [HttpStatus.METHOD_NOT_ALLOWED]: {
    statusCode: HttpStatus.METHOD_NOT_ALLOWED,
    message: 'Method Not Allowed',
  },
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: {
    statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    message: 'Unsupported Media Type',
  },
};

export { DEFINE_STATUS_RESPONSE };

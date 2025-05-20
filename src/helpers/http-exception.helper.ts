import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const throwBadRequest = (msg: string) => {
  throw new BadRequestException(msg);
};
export const throwUnauthorized = (msg: string) => {
  throw new UnauthorizedException(msg);
};
export const throwForbidden = (msg: string) => {
  throw new ForbiddenException(msg);
};
export const throwNotFound = (msg: string) => {
  throw new NotFoundException(msg);
};
export const throwConflict = (msg: string) => {
  throw new ConflictException(msg);
};
export const throwValidation = (msg: string) => {
  throw new UnprocessableEntityException(msg);
};
export const throwInternalError = (msg: string) => {
  throw new InternalServerErrorException(msg);
};

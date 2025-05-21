import { UserNotFoundException } from '@/exceptions';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

const throwBadRequest = (msg: string) => {
  throw new BadRequestException(msg);
};
const throwUnauthorized = (msg: string) => {
  throw new UnauthorizedException(msg);
};
const throwForbidden = (msg: string) => {
  throw new ForbiddenException(msg);
};
const throwNotFound = (msg: string) => {
  throw new NotFoundException(msg);
};
const throwUserNotFound = () => {
  throw new UserNotFoundException();
};
const throwConflict = (msg: string) => {
  throw new ConflictException(msg);
};
const throwValidation = (msg: string) => {
  throw new UnprocessableEntityException(msg);
};
const throwInternalError = (msg: string) => {
  throw new InternalServerErrorException(msg);
};

export {
  throwBadRequest,
  throwUnauthorized,
  throwForbidden,
  throwNotFound,
  throwUserNotFound,
  throwConflict,
  throwValidation,
  throwInternalError,
};

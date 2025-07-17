import { HttpStatus } from '@nestjs/common';
import { getResponseObject } from '../helpers';
import { PageDto, PaginationDto, PaginationMetaDataDto } from '../common/dto';

export class BaseResponse<T> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly timestamp: string;
  public readonly data?: T;

  constructor({
    statusCode,
    data,
    message,
  }: {
    statusCode: number;
    data?: T;
    message: string;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export class BasePageResponse<T> extends BaseResponse<PageDto<T>> {
  constructor({
    statusCode = getResponseObject(HttpStatus.OK).statusCode,
    message,
    data,
    paginationDto,
    totalItem,
  }: {
    statusCode?: number;
    message: string;
    data: T[];
    paginationDto: PaginationDto;
    totalItem: number;
  }) {
    const metaData = new PaginationMetaDataDto(totalItem, paginationDto);
    const pageData = new PageDto(data, metaData);

    super({
      statusCode,
      message,
      data: pageData,
    });
  }
}

export class BaseErrorResponse extends BaseResponse<null> {
  constructor({
    message,
    statusCode,
  }: {
    message: string;
    statusCode?: number;
  }) {
    super({
      statusCode:
        statusCode ?? getResponseObject(HttpStatus.BAD_REQUEST).statusCode,
      message: message ?? getResponseObject(HttpStatus.BAD_REQUEST).message,
    });
  }
}

export class BaseSuccessResponse<T> extends BaseResponse<T> {
  constructor({
    data,
    message,
    statusCode,
  }: {
    data?: T;
    message: string;
    statusCode?: number;
  }) {
    super({
      statusCode: statusCode ?? getResponseObject(HttpStatus.OK).statusCode,
      data,
      message: message ?? getResponseObject(HttpStatus.OK).message,
    });
  }
}

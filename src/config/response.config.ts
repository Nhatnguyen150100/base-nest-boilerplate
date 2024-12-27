import { DEFINE_STATUS_RESPONSE } from './statusResponse.config';

export class BaseResponse<T> {
  statusCode: number;
  message: string;
  timestamp: string;
  data?: T;

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

export class BaseResponseList<TList> extends BaseResponse<{
  content: TList[];
  totalCount: number;
}> {
  constructor({
    statusCode,
    list,
    totalCount,
    message,
  }: {
    statusCode: number;
    list: TList[];
    totalCount: number;
    message: string;
  }) {
    const data = { content: list, totalCount };
    super({ statusCode, data, message });
  }
}

export class BaseErrorResponse extends BaseResponse<null> {
  constructor({ message, statusCode }: { message: string, statusCode?: number }) {
    super({
      statusCode: statusCode ?? DEFINE_STATUS_RESPONSE.BAD_REQUEST.statusCode,
      message: message ?? DEFINE_STATUS_RESPONSE.BAD_REQUEST.message,
    });
  }
}

export class BaseSuccessResponse<T> extends BaseResponse<T> {
  constructor({ data, message }: { data: T; message: string }) {
    super({
      statusCode: DEFINE_STATUS_RESPONSE.SUCCESS.statusCode,
      data,
      message: message ?? DEFINE_STATUS_RESPONSE.SUCCESS.message,
    });
  }
}

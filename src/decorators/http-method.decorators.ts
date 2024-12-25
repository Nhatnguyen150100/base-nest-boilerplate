import { applyDecorators, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { THttpMethod } from '../types/http-method';

interface IProps {
  method: THttpMethod;
  path: string;
  isPrivateRoute?: boolean;
  summary?: string;
  description?: string;
  responses?: { status: number; description: string }[];
}

export function ApiHttpOperation({
  method,
  path,
  isPrivateRoute = true,
  summary,
  description,
  responses = [],
}: IProps) {
  const defaultResponses = [
    { status: 200, description: 'Thành công.' },
    { status: 400, description: 'Yêu cầu không hợp lệ.' },
  ];

  const allResponses = [...defaultResponses, ...responses];

  const methodDecorator = {
    get: () => Get(path),
    post: () => Post(path),
    put: () => Put(path),
    delete: () => Delete(path),
    patch: () => Patch(path),
  }[method];

  if (!methodDecorator) {
    throw new Error(`Method '${method}' is not supported`);
  }

  const apiBearerAuth = isPrivateRoute ? ApiBearerAuth() : null;

  const allDecorators = [
    methodDecorator(),
    ApiOperation({ summary, description }),
    apiBearerAuth,
    ...allResponses.map((response) =>
      ApiResponse({
        status: response.status,
        description: response.description,
      }),
    ),
  ].filter(Boolean);

  return applyDecorators(...allDecorators);
}

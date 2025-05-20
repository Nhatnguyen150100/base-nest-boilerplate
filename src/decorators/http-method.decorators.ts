import { THttpMethod } from '@/types';
import { applyDecorators, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsPublic } from './public.decorators';

interface IProps {
  method: THttpMethod;
  path: string;
  isPrivateRoute?: boolean;
  summary?: string;
  tags: string[];
  description?: string;
  responses?: { status: number; description: string }[];
}

export function ApiHttpOperation({
  method,
  path,
  isPrivateRoute = true,
  summary,
  tags,
  description,
  responses = [],
}: IProps) {
  const defaultResponses = [
    { status: 200, description: 'Request is successfully' },
    { status: 400, description: 'Request is failed' },
    { status: 500, description: 'Server error' },
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

  const apiBearerAuth = isPrivateRoute ? ApiBearerAuth() : IsPublic();

  const allDecorators = [
    methodDecorator(),
    ApiOperation({ summary, description, tags }),
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

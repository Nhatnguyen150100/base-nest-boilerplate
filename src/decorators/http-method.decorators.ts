import { THttpMethod } from '@/types';
import { applyDecorators, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiOperation,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
} from '@nestjs/swagger';
import { IsPublic } from './public.decorators';
import { DEFINE_STATUS_RESPONSE } from '@/config';

type IProps = {
  method: THttpMethod;
  path: string;
  isPrivateRoute?: boolean;
  summary?: string;
  tags: string[];
  description?: string;
  responses?: { status: number; description: string }[];
  queries?: ApiQueryOptions[];
  body?: ApiBodyOptions;
};

export function ApiHttpOperation({
  method,
  path,
  isPrivateRoute = true,
  summary,
  tags,
  description,
  responses = [],
  queries,
  body,
}: IProps) {
  const defaultResponses = Object.values(DEFINE_STATUS_RESPONSE).map(
    (_item) => ({
      status: _item.statusCode,
      description: _item.message,
    }),
  );

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

  const apiQueryDecorators = queries?.map((q) => ApiQuery(q)) ?? [];
  const apiBodyDecorator = body ? ApiBody(body) : null;

  const allDecorators = [
    methodDecorator(),
    ApiOperation({ summary, description, tags }),
    apiBearerAuth,
    apiBodyDecorator,
    ...apiQueryDecorators,
    ...allResponses.map((response) =>
      ApiResponse({
        status: response.status,
        description: response.description,
      }),
    ),
  ].filter(Boolean);

  return applyDecorators(...allDecorators);
}

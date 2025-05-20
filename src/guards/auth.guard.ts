import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { TokenService } from '@/shared/services/token.service';
import { IS_PUBLIC_KEY } from '@/constants';
import { throwUnauthorized } from '@/helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    // If the route is public, allow access
    if (isPublic) return true;

    // Check if the request has an authorization header
    const { authorization } = request.headers;
    const token = authorization?.replace(/bearer/gim, '').trim();
    if (!token) {
      throwUnauthorized(
        'No token provided. Please provide a token first and try again.',
      );
    }

    const userVerify = this.tokenService.verifyToken(token);
    if (!userVerify) {
      throwUnauthorized(
        'Invalid token. Please provide a correct token and try again.',
      );
    }

    request.user = userVerify;

    return true;
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { UserRole } from '../constants';
import { throwForbidden } from '../helpers/http-exception.helper';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throwForbidden('User roles not found');
    }

    const hasRole = () =>
      user.roles.some((role: UserRole) => requiredRoles.includes(role));
    if (!hasRole()) {
      throwForbidden('User does not have the required role');
    }

    return true;
  }
}

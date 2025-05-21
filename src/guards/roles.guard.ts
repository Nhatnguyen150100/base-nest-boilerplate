import { ROLES_KEY } from '@/constants';
import { throwForbidden } from '@/helpers';
import { IRole, IUserReq } from '@/types';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Array<IRole>>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUserReq;

    if (!user?.role) {
      throwForbidden('User role not found');
    }

    const hasRole = () => requiredRoles.includes(user.role);
    if (!hasRole()) {
      throwForbidden('User does not have the required role');
    }

    return true;
  }
}

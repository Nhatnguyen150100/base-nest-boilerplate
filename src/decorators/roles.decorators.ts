import { ROLES_KEY, EUserRole } from '@/constants';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);

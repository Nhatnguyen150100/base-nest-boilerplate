import { AuthGuard, RoleGuard } from '@/guards';
import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Global()
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class GuardModule {}

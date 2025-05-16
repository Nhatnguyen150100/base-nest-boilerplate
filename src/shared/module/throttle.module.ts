import { Module, DynamicModule } from '@nestjs/common';
import {
  ThrottlerModule,
  ThrottlerOptions,
  ThrottlerGuard,
} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const rateLimitConfigs: ThrottlerOptions[] = [
  {
    name: 'short',
    ttl: 1000,
    limit: 3,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  },
];

@Module({})
export class ThrottleModule {
  static register(): DynamicModule {
    return {
      module: ThrottleModule,
      imports: [ThrottlerModule.forRoot(rateLimitConfigs)],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    };
  }
}

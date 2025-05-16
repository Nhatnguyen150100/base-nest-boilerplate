import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DbHealthService } from './services/db-health.service';
import { MemoryHealthService } from './services/memory-health.service';
import { IsPublic } from '../decorators/public.decorators';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DbHealthService,
    private memory: MemoryHealthService,
  ) {}

  @IsPublic()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.check(),
      async () => {
        const results = await this.memory.check();
        return Object.assign({}, ...results);
      },
    ]);
  }
}

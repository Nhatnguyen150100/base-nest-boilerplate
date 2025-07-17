import { Controller } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DbHealthService } from './services/db-health.service';
import { MemoryHealthService } from './services/memory-health.service';
import { ApiHttpOperation } from '@/decorators';
import { DEFINE_TAGS_NAME, EHttpMethod } from '@/constants';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DbHealthService,
    private memory: MemoryHealthService,
  ) {}

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.HEALTH],
    path: '/',
    isPrivateRoute: false,
    summary: 'Check the health of the application',
    description:
      'This endpoint checks the health of the application, including database and memory status.',
  })
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

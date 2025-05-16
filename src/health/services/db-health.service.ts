import { Injectable } from '@nestjs/common';
import {
  TypeOrmHealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class DbHealthService {
  constructor(private readonly db: TypeOrmHealthIndicator) {}

  async check(): Promise<HealthIndicatorResult> {
    return this.db.pingCheck('database');
  }
}

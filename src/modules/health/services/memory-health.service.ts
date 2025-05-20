import { Injectable } from '@nestjs/common';
import { MemoryHealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class MemoryHealthService {
  constructor(private readonly memory: MemoryHealthIndicator) {}

  async check(): Promise<HealthIndicatorResult[]> {
    return [
      await this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      await this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ];
  }
}

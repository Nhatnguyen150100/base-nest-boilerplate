import { AppConfig } from '@/config';
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly appConfig: AppConfig) {}
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: this.appConfig.redisConfig.host,
      port: this.appConfig.redisConfig.port,
      password: this.appConfig.redisConfig.password,
      db: this.appConfig.redisConfig.db,
      keyPrefix: 'nest:',
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () => this.logger.log('🔌 Redis connected'));
    this.client.on('error', (err) => this.logger.error('❌ Redis error', err));
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}

import { ThrottleModule } from './throttle.module';
import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MyJwtModule } from './jwt.module';
import { AppConfig } from '../../config/app.config';
import { MailModule } from './mail/mail.module';
import { TokenService } from '../services/token.service';
import { RedisModule } from './redis/redis.module';

const providers: Provider[] = [AppConfig, TokenService];

@Global()
@Module({
  imports: [
    CqrsModule,
    MyJwtModule.register(),
    ThrottleModule.register(),
    MailModule,
    RedisModule,
  ],
  providers,
  exports: [...providers, CqrsModule, ThrottleModule, MailModule, RedisModule],
})
export class SharedModule {}

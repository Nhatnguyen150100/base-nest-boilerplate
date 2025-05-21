import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserRepository } from './repositories';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, UserRepository],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UserRepository } from '../auth/repositories';

@Module({
  controllers: [UserController],
  providers: [AuthService, UserService, UserRepository],
})
export class UserModule {}

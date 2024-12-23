import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    JwtModule.register({
      privateKey: process.env.PRIVATE_KEY || 'privateKey',
      publicKey: process.env.PUBLIC_KEY || 'publicKey',
      signOptions: { expiresIn: '1d', algorithm: 'RS256' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [TokenService],
})
export class AuthModule {}

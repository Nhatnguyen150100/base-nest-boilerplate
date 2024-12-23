import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): Pick<User, 'email' | 'id' | 'role'> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../modules/auth/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    console.log("🚀 ~ TokenService ~ generateToken ~ payload:", payload)
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): Pick<User, 'email' | 'id' | 'role'> | null {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }
}

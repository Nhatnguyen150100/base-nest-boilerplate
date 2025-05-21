import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserReq } from '../../types/user';
import { User } from '@/modules/auth/entities';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload: IUserReq = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): IUserReq | null {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error: any) {
      return null;
    }
  }
}

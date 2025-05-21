import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from '../auth/dto';
import { PaginationDto } from '@/common/dto';

@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService) {}

  async getUserProfile(userId: string) {
    const user = await this.authService.getUserById(userId);
    return user;
  }

  async updateUserProfile(userId: string, updateData: UpdateUserDto) {
    const updatedUser = await this.authService.updateUser(userId, updateData);
    return updatedUser;
  }

  async getAllUsers(paginationDto: PaginationDto) {
    const users = await this.authService.getAllUsers(paginationDto);
    return users;
  }
}

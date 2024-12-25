import { Injectable, Logger } from '@nestjs/common';
import { TokenService } from '../../shared/services/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  BaseErrorResponse,
  BaseSuccessResponse,
} from '../../config/response.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(userDto: CreateUserDto) {
    try {
      const isExistEmail = await this.userRepository.findOne({
        where: {
          email: userDto.email,
        },
      });
      if (isExistEmail) {
        return Promise.reject(
          new BaseErrorResponse({
            message: 'Email already exists',
          }),
        );
      }

      const newUserObj = this.userRepository.create(userDto);
      await this.userRepository.save(newUserObj);
      delete newUserObj.password;
      return Promise.resolve(
        new BaseSuccessResponse({
          data: newUserObj,
          message: 'User registered successfully',
        }),
      );
    } catch (error: any) {
      Logger.error(error.message);
      return Promise.reject(
        new BaseErrorResponse({
          message: error.message,
        }),
      );
    }
  }

  async login(userDto: CreateUserDto) {
    try {
      const userExit = await this.userRepository.findOne({
        where: {
          email: userDto.email,
        },
      });
      if (!userExit) {
        return Promise.reject(
          new BaseErrorResponse({
            message: 'User not found',
          }),
        );
      }
      const isMatchPassword = await this.comparePassword(
        userDto.password,
        userExit.password,
      );
      if (!isMatchPassword) {
        return Promise.reject(
          new BaseErrorResponse({
            message: 'Password is incorrect',
          }),
        );
      }

      const accessToken = this.tokenService.generateToken(userExit);
      delete userExit.password;
      return Promise.resolve(
        new BaseSuccessResponse({
          data: {
            ...userExit,
            accessToken,
          },
          message: 'User logged in successfully',
        }),
      );
    } catch (error: any) {
      Logger.error(error.message);
      return Promise.reject(
        new BaseErrorResponse({
          message: error.message,
        }),
      );
    }
  }

  private async comparePassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }
}

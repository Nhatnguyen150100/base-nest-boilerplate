import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokenService } from '@/shared/services/token.service';
import { User } from '@/database/entities';
import { CreateUserDto } from '@/database/entities/user/dto';
import { BaseErrorResponse, BaseSuccessResponse } from '@/config';
import { UserNotFoundException } from '@/exceptions';
import { throwBadRequest } from '@/helpers';
import { IUserReq } from '@/types';

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
      if (isExistEmail) throw new ConflictException('Email already exists');

      const newUserObj = this.userRepository.create(userDto);
      await this.userRepository.save(newUserObj);
      delete newUserObj.password;
      return new BaseSuccessResponse({
        data: newUserObj,
        message: 'User registered successfully',
      });
    } catch (error: any) {
      Logger.error(error.message);
      return new BaseErrorResponse({
        message: error.message,
      });
    }
  }

  async login(userDto: CreateUserDto) {
    const userExit = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });
    if (!userExit) {
      throw new UserNotFoundException();
    }
    const isMatchPassword = await this.comparePassword(
      userDto.password,
      userExit.password,
    );
    if (!isMatchPassword) {
      throwBadRequest('Password incorrect. Please try again!');
    }

    const accessToken = this.tokenService.generateToken(userExit);
    delete userExit.password;
    return new BaseSuccessResponse({
      data: {
        ...userExit,
        accessToken,
      },
      message: 'User logged in successfully',
    });
  }

  private async comparePassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UserNotFoundException();
    }
    const user = req.user as IUserReq;
    const payload = {
      email: user.email,
      name: user.name,
    } as User;
    const accessToken = this.tokenService.generateToken(payload);
    return new BaseSuccessResponse({
      data: {
        ...user,
        accessToken,
      },
      message: 'User logged in successfully',
    });
  }
}

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { TokenService } from '@/shared/services/token.service';
import { CreateUserDto, UpdateUserDto } from '@/modules/auth/dto';
import {
  BaseErrorResponse,
  BasePageResponse,
  BaseSuccessResponse,
} from '@/config';
import { UserNotFoundException } from '@/exceptions';
import { throwBadRequest, throwConflict, throwUserNotFound } from '@/helpers';
import { IUserReq } from '@/types';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { PaginationDto } from '@/common/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(userDto: CreateUserDto) {
    const isExistEmail = await this.userRepository.findByEmail(userDto.email);
    if (isExistEmail) throwConflict('Email already exists');

    const newUserObj = this.userRepository.create(userDto);
    const savedUser = await this.userRepository.save(newUserObj);
    delete savedUser.password;

    return new BaseSuccessResponse({
      data: savedUser,
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
    });
  }

  async login(userDto: CreateUserDto) {
    const userExit = await this.userRepository.findByEmail(userDto.email);
    if (!userExit) {
      throwUserNotFound();
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
    return await bcryptjs.compare(password, hashPassword);
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throwUserNotFound();
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

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throwUserNotFound();
    }
    delete user.password;
    return new BaseSuccessResponse({
      data: user,
      message: 'Get user successfully',
    });
  }

  async updateUser(id: string, userDto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throwUserNotFound();
    }
    const updatedUser = await this.userRepository.save({
      ...user,
      ...userDto,
    } as User);
    delete updatedUser.password;
    return new BaseSuccessResponse({
      data: updatedUser,
      message: 'Update user successfully',
    });
  }

  async getAllUsers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return new BasePageResponse({
      data: users.map((user) => {
        delete user.password;
        return user;
      }),
      totalItem: total,
      paginationDto,
      message: 'Get all users successfully',
    });
  }
}

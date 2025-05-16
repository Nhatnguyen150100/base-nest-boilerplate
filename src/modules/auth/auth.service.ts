import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';

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
        return new BaseErrorResponse({
          message: 'Email already exists',
        });
      }

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
      throw new BadRequestException(
        new BaseErrorResponse({ message: 'Password incorrect' }),
      );
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
}

import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from '@/modules/auth/dto';
import { AppConfig, BasePageResponse, BaseSuccessResponse } from '@/config';
import { throwBadRequest, throwConflict, throwUserNotFound } from '@/helpers';
import { IUserReq } from '@/types';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { PaginationDto } from '@/common/dto';
import { MailService } from '@/shared/services/mail.service';
import { TokenService } from '@/shared/services/token.service';
import { RedisService } from '@/shared/services/redis.service';
import { generateOTP } from '@/utils';
import { DEFINE_DEFAULT_OTP } from '@/constants/redis';
import { EUserStatus } from '@/constants';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly appConfig: AppConfig,
    private readonly redisService: RedisService,
  ) {}

  async register(userDto: CreateUserDto) {
    const isExistEmail = await this.userRepository.findByEmail(userDto.email);
    if (isExistEmail) throwConflict('Email already exists');

    const customOTP = this.appConfig.isDevelopment
      ? DEFINE_DEFAULT_OTP
      : generateOTP();

    const redisClient = this.redisService.getClient();

    /**
     * Store OTP in Redis with a 3-minute expiration
     */
    await redisClient.set(userDto.email, customOTP, 'EX', 180);

    const mailContent = {
      to: userDto.email,
      otp: customOTP,
      name: userDto.name.toLocaleUpperCase(),
    };

    await this.mailService.sendOtpEmail(
      mailContent.to,
      mailContent.otp,
      mailContent.name,
    );

    const newUserObj = this.userRepository.create(userDto);
    await this.userRepository.save(newUserObj);

    return new BaseSuccessResponse({
      message:
        'User registered successfully. Please check your email for the OTP.',
    });
  }

  async resendOtp(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.status !== EUserStatus.INACTIVE) {
      throwUserNotFound();
    }

    const customOTP = this.appConfig.isDevelopment
      ? DEFINE_DEFAULT_OTP
      : generateOTP();

    const redisClient = this.redisService.getClient();

    /**
     * Store OTP in Redis with a 3-minute expiration
     */
    await redisClient.set(email, customOTP, 'EX', 180);

    const mailContent = {
      to: email,
      otp: customOTP,
      name: user.name,
    };

    await this.mailService.sendOtpEmail(
      mailContent.to,
      mailContent.otp,
      mailContent.name,
    );

    return new BaseSuccessResponse({
      message: 'Resend OTP successfully. Please check your email for the OTP.',
    });
  }

  async verifyOtp(verifyDto: VerifyOtpDto) {
    const { email, otp } = verifyDto;
    const redisClient = this.redisService.getClient();
    const storedOtp = await redisClient.get(email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throwUserNotFound();
    }

    if (!storedOtp) {
      throwBadRequest('OTP has expired or does not exist');
    }

    if (storedOtp !== otp) {
      throwBadRequest('Invalid OTP. Please try again.');
    }

    user.status = EUserStatus.ACTIVE;
    await this.userRepository.save(user);
    delete user.password;

    // Remove OTP from Redis after successful verification
    await redisClient.del(email);

    return new BaseSuccessResponse({
      data: user,
      message: 'Email verified successfully',
      statusCode: HttpStatus.CREATED,
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

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '@/modules/auth/dto';
import { ApiHttpOperation } from '@/decorators';
import { DEFINE_TAGS_NAME, EHttpMethod } from '@/constants';
import { GoogleOAuthGuard } from '@/guards';
import { User } from './entities';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
@ApiExtraModels(User, CreateUserDto, UpdateUserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiHttpOperation({
    method: EHttpMethod.POST,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'login',
    summary: 'Login with email and password',
  })
  @HttpCode(HttpStatus.OK)
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @ApiHttpOperation({
    method: EHttpMethod.POST,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'register',
    summary: 'Register a new user',
  })
  @HttpCode(HttpStatus.OK)
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @ApiHttpOperation({
    method: EHttpMethod.PUT,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'resend-otp',
    summary: 'Send OTP to email for registration',
    description: 'This endpoint allows users to resend OTP to their email.',
  })
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto.email);
  }

  @ApiHttpOperation({
    method: EHttpMethod.POST,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'verify-otp',
    summary: 'Verify OTP for registration',
    description:
      'This endpoint allows users to verify their OTP for registration.',
  })
  verifyOtp(@Body() verifyOtp: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtp);
  }

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'google',
    summary:
      'Login by Google account (This endpoint is read-only in Swagger UI)',
    description: 'You can view this, but it is disabled for Try it out',
  })
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'google/callback',
    summary:
      'Callback after login by Google account (This endpoint is read-only in Swagger UI)',
    description: 'You can view this, but it is disabled for Try it out',
  })
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: any) {
    return this.authService.googleLogin(req);
  }
}

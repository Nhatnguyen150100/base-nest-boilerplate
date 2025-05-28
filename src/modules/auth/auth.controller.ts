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

@Controller('auth')
@ApiExtraModels(User, CreateUserDto, UpdateUserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiHttpOperation({
    method: EHttpMethod.POST,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'login',
    summary: 'Đăng nhập tài khoản',
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
    summary: 'Đăng kí tài khoản mới',
  })
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'google',
    summary:
      'Đăng nhập bằng tài khoản Google (This endpoint is read-only in Swagger UI)',
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
      'Callback sau khi đăng nhập bằng tài khoản Google (This endpoint is read-only in Swagger UI)',
    description: 'You can view this, but it is disabled for Try it out',
  })
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: any) {
    return this.authService.googleLogin(req);
  }
}

import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExtraModels } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { DEFINE_TAGS_NAME, EHttpMethod } from '../../constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHttpOperation } from '../../decorators';
import { GoogleOAuthGuard } from '../../guards';

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
  async login(@Body() userDto: CreateUserDto) {
    return await this.authService.login(userDto);
  }

  @ApiHttpOperation({
    method: EHttpMethod.POST,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'register',
    summary: 'Đăng kí tài khoản mới',
  })
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'google',
    summary: 'Đăng nhập bằng tài khoản Google',
  })
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'google/callback',
    summary: 'Callback sau khi đăng nhập bằng tài khoản Google',
  })
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: any) {
    return this.authService.googleLogin(req);
  }
}

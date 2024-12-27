import { BadRequestException, Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiHttpOperation } from '../../decorators/http-method.decorators';
import HTTP_METHOD from '../../constants/http-method';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { DEFINE_TAGS_NAME } from '../../constants/tags-swagger';
import { IsPublic } from '../../decorators/public.decorators';
import { BaseErrorResponse } from '../../config/response.config';

@Controller('auth')
@ApiExtraModels(User, CreateUserDto, UpdateUserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiHttpOperation({
    method: HTTP_METHOD.POST,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'login',
    summary: 'Đăng nhập tài khoản',
  })
  @IsPublic()
  async login(@Body() userDto: CreateUserDto) {
    return await this.authService.login(userDto);
  }

  @ApiHttpOperation({
    method: HTTP_METHOD.POST,
    tags: [DEFINE_TAGS_NAME.AUTH],
    isPrivateRoute: false,
    path: 'register',
    summary: 'Đăng kí tài khoản mới',
  })
  @IsPublic()
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }

  @Get('error')
  async throwError() {
    throw new BadRequestException(
      new BaseErrorResponse({ message: 'Password incorrect' }),
    );
  }
}

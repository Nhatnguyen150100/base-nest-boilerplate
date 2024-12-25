import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHttpOperation } from '../../decorators/http-method.decorators';
import HTTP_METHOD from '../../constants/http-method';

@Controller('auth')
@ApiTags('Auth')
@ApiExtraModels(CreateUserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiHttpOperation({
    method: HTTP_METHOD.POST,
    isPrivateRoute: false,
    path: 'login',
    summary: 'Đăng nhập tài khoản',
  })
  async login(@Body() userDto: CreateUserDto) {
    return await this.authService.login(userDto);
  }

  @ApiHttpOperation({
    method: HTTP_METHOD.POST,
    isPrivateRoute: false,
    path: 'register',
    summary: 'Đăng kí tài khoản',
  })
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }
}

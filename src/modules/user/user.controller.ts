import { DEFINE_TAGS_NAME, EHttpMethod, EUserRole } from '@/constants';
import { ApiHttpOperation, Roles } from '@/decorators';
import { IUserReq } from '@/types';
import { Body, Controller, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from '@/common/dto';
import { UpdateUserDto } from '../auth/dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.USER],
    path: '/me',
    summary: 'Lấy thông tin của chính mình',
  })
  getAllUser(@Req() req: any) {
    const user = req.user as IUserReq;
    return this.userService.getUserProfile(user.id);
  }

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.USER],
    path: '/all',
    summary: 'Lấy danh sách tất cả người dùng (dành cho admin)',
    queries: [
      {
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Trang hiện tại',
      },
      {
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Số bản ghi mỗi trang',
      },
    ],
  })
  @Roles(EUserRole.ADMIN)
  getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.userService.getAllUsers(paginationDto);
  }

  @ApiHttpOperation({
    method: EHttpMethod.PUT,
    tags: [DEFINE_TAGS_NAME.USER],
    path: '/update',
    summary: 'Cập nhật thông tin người dùng',
    body: {
      required: true,
      description: 'Thông tin người dùng cần cập nhật',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Tên người dùng',
          },
          avatar: {
            type: 'string',
            description: 'URL ảnh đại diện người dùng',
          },
          address: {
            type: 'string',
            description: 'Địa chỉ người dùng',
          },
          phoneNumber: {
            type: 'string',
            description: 'Số điện thoại người dùng',
          },
        },
      },
    },
  })
  @Roles(EUserRole.USER)
  updateUserProfile(@Req() req: any, @Body() body: UpdateUserDto) {
    const user = req.user as IUserReq;
    return this.userService.updateUserProfile(user.id, body);
  }
}

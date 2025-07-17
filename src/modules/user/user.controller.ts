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
    summary: 'Get current user profile',
    description:
      'This endpoint retrieves the profile of the currently authenticated user.',
  })
  getAllUser(@Req() req: any) {
    const user = req.user as IUserReq;
    return this.userService.getUserProfile(user.id);
  }

  @ApiHttpOperation({
    method: EHttpMethod.GET,
    tags: [DEFINE_TAGS_NAME.USER],
    path: '/all',
    summary: 'Get all users in the system (Admin only)',
    description: 'This endpoint retrieves all users in the system.',
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
    summary: 'Update user profile',
    description:
      'This endpoint allows users to update their profile information.',
    body: {
      required: true,
      description: 'Update user profile information',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the user',
          },
          avatar: {
            type: 'string',
            description: 'URL of the user avatar',
          },
          address: {
            type: 'string',
            description: 'Address of the user',
          },
          phoneNumber: {
            type: 'string',
            description: 'Phone number of the user',
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

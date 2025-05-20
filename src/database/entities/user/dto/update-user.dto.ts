import { StringFieldOptional } from '@/decorators';

export class UpdateUserDto {
  @StringFieldOptional({
    example: 'User name',
    description: 'Name of the user',
  })
  name: string;

  @StringFieldOptional({
    example: 'Avatar URL',
    description: 'Avatar URL of the user',
  })
  avatar: string;

  @StringFieldOptional({
    example: '0987654321',
    description: 'Phone number of the user',
  })
  phoneNumber: string;

  @StringFieldOptional({
    example: '123 Main St, City, Country',
    description: 'Address of the user',
  })
  address: string;
}

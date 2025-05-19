import { StringFieldOptional } from '../../../decorators';

export class UpdateUserDto {
  @StringFieldOptional({
    example: 'user full name',
    description: 'Full name of the user',
  })
  fullName: string;
}

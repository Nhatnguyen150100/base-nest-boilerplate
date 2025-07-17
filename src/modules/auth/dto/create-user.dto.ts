import {
  EmailField,
  PasswordField,
  StringField,
  StringFieldOptional,
} from '@/decorators';

export class CreateUserDto {
  @EmailField({
    example: 'user1@gmail.com',
    description: 'Unique email address',
  })
  readonly email: string;

  @StringFieldOptional({
    example: 'User name',
    description: 'Name of the user',
  })
  readonly name?: string;

  @PasswordField({
    description:
      'Password must contain at least 8 characters and should not contain any special characters.',
    example: 'password123!',
  })
  readonly password: string;
}

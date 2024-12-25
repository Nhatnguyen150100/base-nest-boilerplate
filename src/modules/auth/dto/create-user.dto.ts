import { EmailField, PasswordField } from '../../../decorators/field.decorators';

export class CreateUserDto {
  @EmailField({
    example: 'user1@gmail.com'
  })
  readonly email: string;

  @PasswordField({
    description: 'Password must contain at least 8 characters and should not contain any special characters.',
    example: "password123!"
  })
  readonly password: string;
}

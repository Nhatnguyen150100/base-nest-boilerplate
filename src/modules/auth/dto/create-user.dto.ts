import { EmailField, PasswordField } from '../../../decorators/field.decorators';

export class CreateUserDto {
  @EmailField()
  readonly email: string;

  @PasswordField({
    description: 'Password must contain at least 8 characters and should not contain any special characters.',
  })
  readonly password: string;
}

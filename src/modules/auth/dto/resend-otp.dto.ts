import { EmailField, StringField } from '@/decorators';

export class ResendOtpDto {
  @StringField({
    description: 'Email of the user to verify',
    example: 'user1@gmail.com',
  })
  @EmailField()
  email: string;
}

import { EmailField, StringField } from '@/decorators';

export class VerifyOtpDto {
  @StringField({
    description: 'Email of the user to verify',
    example: 'user1@gmail.com',
  })
  @EmailField()
  email: string;

  @StringField({
    description: 'One Time Password (OTP) sent to the user',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  otp: string;
}

import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../base';
import {
  EmailField,
  EnumField,
  PasswordField,
  StringField,
} from '@/decorators';
import { UserRole } from '@/constants';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @Column({
    nullable: true,
  })
  @StringField()
  name: string;

  @Column()
  @EmailField()
  email: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column()
  @PasswordField({
    description:
      'Password must contain at least 8 characters and should not contain any special characters.',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @EnumField(() => UserRole)
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}

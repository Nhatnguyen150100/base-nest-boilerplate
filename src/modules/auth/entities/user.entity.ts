import * as bcryptjs from 'bcryptjs';
import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import {
  EmailField,
  EnumField,
  PasswordField,
  StringField,
} from '@/decorators';
import { EUserStatus, EUserRole } from '@/constants';
import { BaseEntity } from '@/database/entities';

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
    enum: EUserRole,
    default: EUserRole.USER,
  })
  @EnumField(() => EUserRole)
  role: EUserRole;

  @Column({
    type: 'enum',
    enum: EUserStatus,
    default: EUserStatus.INACTIVE,
  })
  status: EUserStatus;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  }
}

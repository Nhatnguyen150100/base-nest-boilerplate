import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { UserRole } from '../../../constants/role';
import { BaseEntity } from '../../../databases/entity/base.entity';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @Column({
    nullable: true,
  })
  @IsString()
  fullName: string;

  @Column()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}

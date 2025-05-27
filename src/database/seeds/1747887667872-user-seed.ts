import { User } from '@/modules/auth/entities';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcryptjs from 'bcryptjs';
import { EUserRole } from '@/constants';
import { Logger } from '@nestjs/common';

export class UserSeed1747887667872 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);

    const password = 'password';
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const dataSeed = [
      {
        email: 'user1@gmail.com',
        password: hashedPassword,
        role: EUserRole.USER,
      },
      {
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: EUserRole.ADMIN,
      },
    ];

    try {
      await repository.insert(dataSeed);
      Logger.log('User data inserted successfully', UserSeed1747887667872.name);
    } catch (error) {
      Logger.error('Error inserting user data: ' + error);
    }
  }
}

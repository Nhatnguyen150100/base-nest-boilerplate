import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(user: Partial<User>): User {
    return this.repo.create(user);
  }

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async findAndCount(options: any): Promise<[User[], number]> {
    return this.repo.findAndCount(options);
  }
}

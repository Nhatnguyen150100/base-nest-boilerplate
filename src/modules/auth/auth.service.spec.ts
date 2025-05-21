import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokenService } from '../../shared/services/token.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockTokenService = {
  generateToken: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: TokenService, useValue: mockTokenService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

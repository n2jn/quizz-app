import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUserHandler } from '../login-user.handler';
import { LoginUserCommand } from '../login-user.command';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../../domain/aggregates/user.aggregate';
import { Email } from '../../../domain/value-objects/email.vo';
import { Username } from '../../../domain/value-objects/username.vo';

describe('LoginUserHandler', () => {
  let handler: LoginUserHandler;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      exists: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserHandler,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    handler = module.get<LoginUserHandler>(LoginUserHandler);
    userRepository = module.get('IUserRepository');
  });

  describe('execute', () => {
    const validCommand = new LoginUserCommand('user@example.com', 'password123');

    const mockUser = User.fromPersistence({
      id: 'user-id-123',
      email: Email.create('user@example.com'),
      username: Username.create('john_doe'),
      passwordHash: '$2b$12$hashedpassword',
      role: UserRole.PLAYER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it('should login user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await handler.execute(validCommand);

      expect(result.userId).toBe('user-id-123');
      expect(result.email).toBe('user@example.com');
      expect(result.username).toBe('john_doe');
      expect(result.role).toBe('PLAYER');
    });

    it('should find user by email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await handler.execute(validCommand);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        expect.objectContaining({ props: { value: 'user@example.com' } }),
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(handler.execute(validCommand)).rejects.toThrow(UnauthorizedException);
      await expect(handler.execute(validCommand)).rejects.toThrow('Invalid credentials');
    });

    it('should return correct user role for admin', async () => {
      const adminUser = User.fromPersistence({
        id: 'admin-id-123',
        email: Email.create('admin@example.com'),
        username: Username.create('admin_user'),
        passwordHash: '$2b$12$hashedpassword',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      userRepository.findByEmail.mockResolvedValue(adminUser);

      const command = new LoginUserCommand('admin@example.com', 'password123');
      const result = await handler.execute(command);

      expect(result.role).toBe('ADMIN');
    });

    it('should normalize email to lowercase when finding user', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const command = new LoginUserCommand('User@Example.COM', 'password123');
      await handler.execute(command);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        expect.objectContaining({ props: { value: 'user@example.com' } }),
      );
    });

    it('should throw error for invalid email format', async () => {
      const invalidCommand = new LoginUserCommand('invalid-email', 'password123');

      await expect(handler.execute(invalidCommand)).rejects.toThrow();
    });
  });
});

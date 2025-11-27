import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserHandler } from '../register-user.handler';
import { RegisterUserCommand } from '../register-user.command';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
import { User } from '../../../domain/aggregates/user.aggregate';
import { Email } from '../../../domain/value-objects/email.vo';
import { Username } from '../../../domain/value-objects/username.vo';
import { EntityAlreadyExistsException } from '@shared/domain/exceptions';

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let userRepository: jest.Mocked<IUserRepository>;
  let eventBus: jest.Mocked<EventBusService>;

  beforeEach(async () => {
    const mockUserRepository = {
      exists: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      delete: jest.fn(),
    };

    const mockEventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: EventBusService,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    handler = module.get<RegisterUserHandler>(RegisterUserHandler);
    userRepository = module.get('IUserRepository');
    eventBus = module.get(EventBusService);
  });

  describe('execute', () => {
    const validCommand = new RegisterUserCommand(
      'user@example.com',
      'john_doe',
      '$2b$12$hashedpassword',
    );

    it('should register a new user successfully', async () => {
      userRepository.exists.mockResolvedValue(false);
      userRepository.save.mockResolvedValue(undefined);
      eventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(validCommand);

      expect(result.email).toBe('user@example.com');
      expect(result.username).toBe('john_doe');
      expect(result.userId).toBeDefined();
      expect(typeof result.userId).toBe('string');
    });

    it('should check if user already exists', async () => {
      userRepository.exists.mockResolvedValue(false);
      userRepository.save.mockResolvedValue(undefined);

      await handler.execute(validCommand);

      expect(userRepository.exists).toHaveBeenCalledWith(
        expect.objectContaining({ props: { value: 'user@example.com' } }),
        expect.objectContaining({ props: { value: 'john_doe' } }),
      );
    });

    it('should throw EntityAlreadyExistsException if user exists', async () => {
      userRepository.exists.mockResolvedValue(true);

      await expect(handler.execute(validCommand)).rejects.toThrow(EntityAlreadyExistsException);
      await expect(handler.execute(validCommand)).rejects.toThrow('user@example.com');
    });

    it('should save user to repository', async () => {
      userRepository.exists.mockResolvedValue(false);
      userRepository.save.mockResolvedValue(undefined);

      await handler.execute(validCommand);

      expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should publish domain events', async () => {
      userRepository.exists.mockResolvedValue(false);
      userRepository.save.mockResolvedValue(undefined);

      await handler.execute(validCommand);

      expect(eventBus.publishAll).toHaveBeenCalled();
      const publishedEvents = eventBus.publishAll.mock.calls[0][0];
      expect(publishedEvents).toHaveLength(1);
      expect(publishedEvents[0].eventName).toBe('user.registered');
    });

    it('should throw error for invalid email', async () => {
      const invalidCommand = new RegisterUserCommand(
        'invalid-email',
        'john_doe',
        '$2b$12$hashedpassword',
      );

      await expect(handler.execute(invalidCommand)).rejects.toThrow();
    });

    it('should throw error for invalid username', async () => {
      const invalidCommand = new RegisterUserCommand(
        'user@example.com',
        'ab', // too short
        '$2b$12$hashedpassword',
      );

      await expect(handler.execute(invalidCommand)).rejects.toThrow();
    });

    it('should normalize email to lowercase', async () => {
      const command = new RegisterUserCommand(
        'User@Example.COM',
        'john_doe',
        '$2b$12$hashedpassword',
      );
      userRepository.exists.mockResolvedValue(false);
      userRepository.save.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result.email).toBe('user@example.com');
    });
  });
});

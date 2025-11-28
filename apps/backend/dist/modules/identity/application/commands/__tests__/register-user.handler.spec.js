"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const register_user_handler_1 = require("../register-user.handler");
const register_user_command_1 = require("../register-user.command");
const event_bus_service_1 = require("../../../../../shared/infrastructure/events/event-bus.service");
const user_aggregate_1 = require("../../../domain/aggregates/user.aggregate");
const exceptions_1 = require("../../../../../shared/domain/exceptions");
describe('RegisterUserHandler', () => {
    let handler;
    let userRepository;
    let eventBus;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                register_user_handler_1.RegisterUserHandler,
                {
                    provide: 'IUserRepository',
                    useValue: mockUserRepository,
                },
                {
                    provide: event_bus_service_1.EventBusService,
                    useValue: mockEventBus,
                },
            ],
        }).compile();
        handler = module.get(register_user_handler_1.RegisterUserHandler);
        userRepository = module.get('IUserRepository');
        eventBus = module.get(event_bus_service_1.EventBusService);
    });
    describe('execute', () => {
        const validCommand = new register_user_command_1.RegisterUserCommand('user@example.com', 'john_doe', '$2b$12$hashedpassword');
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
            expect(userRepository.exists).toHaveBeenCalledWith(expect.objectContaining({ props: { value: 'user@example.com' } }), expect.objectContaining({ props: { value: 'john_doe' } }));
        });
        it('should throw EntityAlreadyExistsException if user exists', async () => {
            userRepository.exists.mockResolvedValue(true);
            await expect(handler.execute(validCommand)).rejects.toThrow(exceptions_1.EntityAlreadyExistsException);
            await expect(handler.execute(validCommand)).rejects.toThrow('user@example.com');
        });
        it('should save user to repository', async () => {
            userRepository.exists.mockResolvedValue(false);
            userRepository.save.mockResolvedValue(undefined);
            await handler.execute(validCommand);
            expect(userRepository.save).toHaveBeenCalledWith(expect.any(user_aggregate_1.User));
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
            const invalidCommand = new register_user_command_1.RegisterUserCommand('invalid-email', 'john_doe', '$2b$12$hashedpassword');
            await expect(handler.execute(invalidCommand)).rejects.toThrow();
        });
        it('should throw error for invalid username', async () => {
            const invalidCommand = new register_user_command_1.RegisterUserCommand('user@example.com', 'ab', '$2b$12$hashedpassword');
            await expect(handler.execute(invalidCommand)).rejects.toThrow();
        });
        it('should normalize email to lowercase', async () => {
            const command = new register_user_command_1.RegisterUserCommand('User@Example.COM', 'john_doe', '$2b$12$hashedpassword');
            userRepository.exists.mockResolvedValue(false);
            userRepository.save.mockResolvedValue(undefined);
            const result = await handler.execute(command);
            expect(result.email).toBe('user@example.com');
        });
    });
});
//# sourceMappingURL=register-user.handler.spec.js.map
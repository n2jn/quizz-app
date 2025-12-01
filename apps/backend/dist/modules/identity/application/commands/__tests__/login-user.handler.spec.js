"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const login_user_handler_1 = require("../login-user.handler");
const login_user_command_1 = require("../login-user.command");
const user_aggregate_1 = require("../../../domain/aggregates/user.aggregate");
const email_vo_1 = require("../../../domain/value-objects/email.vo");
const username_vo_1 = require("../../../domain/value-objects/username.vo");
describe('LoginUserHandler', () => {
    let handler;
    let userRepository;
    beforeEach(async () => {
        const mockUserRepository = {
            findByEmail: jest.fn(),
            exists: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            findByUsername: jest.fn(),
            delete: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                login_user_handler_1.LoginUserHandler,
                {
                    provide: 'IUserRepository',
                    useValue: mockUserRepository,
                },
            ],
        }).compile();
        handler = module.get(login_user_handler_1.LoginUserHandler);
        userRepository = module.get('IUserRepository');
    });
    describe('execute', () => {
        const validCommand = new login_user_command_1.LoginUserCommand('user@example.com', 'password123');
        const mockUser = user_aggregate_1.User.fromPersistence({
            id: 'user-id-123',
            email: email_vo_1.Email.create('user@example.com'),
            username: username_vo_1.Username.create('john_doe'),
            name: 'John Doe',
            passwordHash: '$2b$12$hashedpassword',
            role: user_aggregate_1.UserRole.PLAYER,
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
            expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.objectContaining({ props: { value: 'user@example.com' } }));
        });
        it('should throw UnauthorizedException if user not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            await expect(handler.execute(validCommand)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(handler.execute(validCommand)).rejects.toThrow('Invalid credentials');
        });
        it('should return correct user role for admin', async () => {
            const adminUser = user_aggregate_1.User.fromPersistence({
                id: 'admin-id-123',
                email: email_vo_1.Email.create('admin@example.com'),
                username: username_vo_1.Username.create('admin_user'),
                name: 'Admin User',
                passwordHash: '$2b$12$hashedpassword',
                role: user_aggregate_1.UserRole.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            userRepository.findByEmail.mockResolvedValue(adminUser);
            const command = new login_user_command_1.LoginUserCommand('admin@example.com', 'password123');
            const result = await handler.execute(command);
            expect(result.role).toBe('ADMIN');
        });
        it('should normalize email to lowercase when finding user', async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            const command = new login_user_command_1.LoginUserCommand('User@Example.COM', 'password123');
            await handler.execute(command);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.objectContaining({ props: { value: 'user@example.com' } }));
        });
        it('should throw error for invalid email format', async () => {
            const invalidCommand = new login_user_command_1.LoginUserCommand('invalid-email', 'password123');
            await expect(handler.execute(invalidCommand)).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=login-user.handler.spec.js.map
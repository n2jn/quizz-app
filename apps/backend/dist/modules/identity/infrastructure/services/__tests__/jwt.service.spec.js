"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("../jwt.service");
const prisma_service_1 = require("../../../../../shared/infrastructure/database/prisma.service");
describe('JwtTokenService', () => {
    let service;
    let jwtService;
    let prismaService;
    beforeEach(async () => {
        const mockJwtService = {
            sign: jest.fn(),
            decode: jest.fn(),
        };
        const mockPrismaService = {
            refreshToken: {
                create: jest.fn(),
                findUnique: jest.fn(),
                delete: jest.fn(),
                deleteMany: jest.fn(),
            },
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                jwt_service_1.JwtTokenService,
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(jwt_service_1.JwtTokenService);
        jwtService = module.get(jwt_1.JwtService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    describe('generateTokenPair', () => {
        const userId = 'user-id-123';
        const email = 'user@example.com';
        const username = 'john_doe';
        const role = 'PLAYER';
        it('should generate access and refresh tokens', async () => {
            jwtService.sign.mockReturnValue('mock-access-token');
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'refresh-token-id',
                token: 'mock-refresh-token',
                userId,
                expiresAt: new Date(),
                createdAt: new Date(),
            });
            const result = await service.generateTokenPair(userId, email, username, role);
            expect(result.accessToken).toBe('mock-access-token');
            expect(result.refreshToken).toBeDefined();
            expect(typeof result.refreshToken).toBe('string');
        });
        it('should create access token with correct payload', async () => {
            jwtService.sign.mockReturnValue('mock-access-token');
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'refresh-token-id',
                token: 'mock-refresh-token',
                userId,
                expiresAt: new Date(),
                createdAt: new Date(),
            });
            await service.generateTokenPair(userId, email, username, role);
            expect(jwtService.sign).toHaveBeenCalledWith({
                sub: userId,
                email,
                username,
                role,
            }, expect.any(Object));
        });
        it('should store refresh token in database', async () => {
            jwtService.sign.mockReturnValue('mock-access-token');
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'refresh-token-id',
                token: 'mock-refresh-token',
                userId,
                expiresAt: new Date(),
                createdAt: new Date(),
            });
            await service.generateTokenPair(userId, email, username, role);
            expect(prismaService.refreshToken.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    token: expect.any(String),
                    userId,
                    expiresAt: expect.any(Date),
                }),
            });
        });
    });
    describe('refreshAccessToken', () => {
        it('should return new token pair for valid refresh token', async () => {
            const mockStoredToken = {
                id: 'refresh-token-id',
                token: 'valid-refresh-token',
                userId: 'user-id-123',
                expiresAt: new Date(Date.now() + 86400000),
                createdAt: new Date(),
                user: {
                    id: 'user-id-123',
                    email: 'user@example.com',
                    username: 'john_doe',
                    role: 'PLAYER',
                    password: 'hashed',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            };
            prismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            prismaService.refreshToken.delete.mockResolvedValue({});
            jwtService.sign.mockReturnValue('new-access-token');
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'new-refresh-token-id',
                token: 'new-refresh-token',
                userId: 'user-id-123',
                expiresAt: new Date(),
                createdAt: new Date(),
            });
            const result = await service.refreshAccessToken('valid-refresh-token');
            expect(result).not.toBeNull();
            expect(result?.accessToken).toBe('new-access-token');
            expect(result?.refreshToken).toBeDefined();
        });
        it('should return null for non-existent refresh token', async () => {
            prismaService.refreshToken.findUnique.mockResolvedValue(null);
            const result = await service.refreshAccessToken('invalid-token');
            expect(result).toBeNull();
        });
        it('should return null for expired refresh token', async () => {
            const mockExpiredToken = {
                id: 'refresh-token-id',
                token: 'expired-token',
                userId: 'user-id-123',
                expiresAt: new Date(Date.now() - 86400000),
                createdAt: new Date(),
                user: {
                    id: 'user-id-123',
                    email: 'user@example.com',
                    username: 'john_doe',
                    role: 'PLAYER',
                    password: 'hashed',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            };
            prismaService.refreshToken.findUnique.mockResolvedValue(mockExpiredToken);
            const result = await service.refreshAccessToken('expired-token');
            expect(result).toBeNull();
        });
        it('should delete old refresh token', async () => {
            const mockStoredToken = {
                id: 'refresh-token-id',
                token: 'valid-refresh-token',
                userId: 'user-id-123',
                expiresAt: new Date(Date.now() + 86400000),
                createdAt: new Date(),
                user: {
                    id: 'user-id-123',
                    email: 'user@example.com',
                    username: 'john_doe',
                    role: 'PLAYER',
                    password: 'hashed',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            };
            prismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            prismaService.refreshToken.delete.mockResolvedValue({});
            jwtService.sign.mockReturnValue('new-access-token');
            prismaService.refreshToken.create.mockResolvedValue({
                id: 'new-refresh-token-id',
                token: 'new-refresh-token',
                userId: 'user-id-123',
                expiresAt: new Date(),
                createdAt: new Date(),
            });
            await service.refreshAccessToken('valid-refresh-token');
            expect(prismaService.refreshToken.delete).toHaveBeenCalledWith({
                where: { token: 'valid-refresh-token' },
            });
        });
    });
    describe('revokeRefreshToken', () => {
        it('should delete refresh token from database', async () => {
            prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 1 });
            await service.revokeRefreshToken('token-to-revoke');
            expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { token: 'token-to-revoke' },
            });
        });
    });
    describe('revokeAllUserTokens', () => {
        it('should delete all user tokens from database', async () => {
            prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 3 });
            await service.revokeAllUserTokens('user-id-123');
            expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: { userId: 'user-id-123' },
            });
        });
    });
});
//# sourceMappingURL=jwt.service.spec.js.map
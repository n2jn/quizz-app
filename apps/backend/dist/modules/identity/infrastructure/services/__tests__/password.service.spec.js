"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const password_service_1 = require("../password.service");
describe('PasswordService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [password_service_1.PasswordService],
        }).compile();
        service = module.get(password_service_1.PasswordService);
    });
    describe('hash', () => {
        it('should hash a password', async () => {
            const plainPassword = 'Password123!';
            const hashedPassword = await service.hash(plainPassword);
            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(plainPassword);
            expect(hashedPassword.length).toBeGreaterThan(0);
        });
        it('should generate different hashes for same password', async () => {
            const plainPassword = 'Password123!';
            const hash1 = await service.hash(plainPassword);
            const hash2 = await service.hash(plainPassword);
            expect(hash1).not.toBe(hash2);
        });
        it('should generate bcrypt-compatible hash', async () => {
            const plainPassword = 'Password123!';
            const hashedPassword = await service.hash(plainPassword);
            expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$/);
        });
        it('should hash empty string', async () => {
            const hashedPassword = await service.hash('');
            expect(hashedPassword).toBeDefined();
        });
    });
    describe('compare', () => {
        it('should return true for matching password', async () => {
            const plainPassword = 'Password123!';
            const hashedPassword = await service.hash(plainPassword);
            const result = await service.compare(plainPassword, hashedPassword);
            expect(result).toBe(true);
        });
        it('should return false for non-matching password', async () => {
            const plainPassword = 'Password123!';
            const wrongPassword = 'WrongPassword456!';
            const hashedPassword = await service.hash(plainPassword);
            const result = await service.compare(wrongPassword, hashedPassword);
            expect(result).toBe(false);
        });
        it('should be case-sensitive', async () => {
            const plainPassword = 'Password123!';
            const hashedPassword = await service.hash(plainPassword);
            const result = await service.compare('password123!', hashedPassword);
            expect(result).toBe(false);
        });
        it('should return false for empty password against hash', async () => {
            const plainPassword = 'Password123!';
            const hashedPassword = await service.hash(plainPassword);
            const result = await service.compare('', hashedPassword);
            expect(result).toBe(false);
        });
        it('should handle special characters in password', async () => {
            const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const hashedPassword = await service.hash(specialPassword);
            const result = await service.compare(specialPassword, hashedPassword);
            expect(result).toBe(true);
        });
        it('should handle unicode characters in password', async () => {
            const unicodePassword = 'Пароль123!';
            const hashedPassword = await service.hash(unicodePassword);
            const result = await service.compare(unicodePassword, hashedPassword);
            expect(result).toBe(true);
        });
        it('should handle very long passwords', async () => {
            const longPassword = 'a'.repeat(100);
            const hashedPassword = await service.hash(longPassword);
            const result = await service.compare(longPassword, hashedPassword);
            expect(result).toBe(true);
        });
    });
});
//# sourceMappingURL=password.service.spec.js.map
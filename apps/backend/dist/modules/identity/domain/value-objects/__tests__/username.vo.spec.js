"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const username_vo_1 = require("../username.vo");
const exceptions_1 = require("../../../../../shared/domain/exceptions");
describe('Username Value Object', () => {
    describe('create', () => {
        it('should create a valid username', () => {
            const username = username_vo_1.Username.create('john_doe');
            expect(username.value).toBe('john_doe');
        });
        it('should accept alphanumeric characters', () => {
            const username = username_vo_1.Username.create('user123');
            expect(username.value).toBe('user123');
        });
        it('should accept underscores', () => {
            const username = username_vo_1.Username.create('john_doe_123');
            expect(username.value).toBe('john_doe_123');
        });
        it('should trim whitespace', () => {
            const username = username_vo_1.Username.create('  johndoe  ');
            expect(username.value).toBe('johndoe');
        });
        it('should accept minimum length username (3 chars)', () => {
            const username = username_vo_1.Username.create('abc');
            expect(username.value).toBe('abc');
        });
        it('should accept maximum length username (20 chars)', () => {
            const username = username_vo_1.Username.create('12345678901234567890');
            expect(username.value).toBe('12345678901234567890');
        });
        it('should throw error for empty username', () => {
            expect(() => username_vo_1.Username.create('')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('')).toThrow('Username cannot be empty');
        });
        it('should throw error for whitespace-only username', () => {
            expect(() => username_vo_1.Username.create('   ')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('   ')).toThrow('Username cannot be empty');
        });
        it('should throw error for username too short (< 3 chars)', () => {
            expect(() => username_vo_1.Username.create('ab')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('ab')).toThrow('Username must be at least 3 characters');
        });
        it('should throw error for username too long (> 20 chars)', () => {
            expect(() => username_vo_1.Username.create('123456789012345678901')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('123456789012345678901')).toThrow('Username cannot exceed 20 characters');
        });
        it('should throw error for username with spaces', () => {
            expect(() => username_vo_1.Username.create('john doe')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('john doe')).toThrow('Username can only contain letters, numbers, and underscores');
        });
        it('should throw error for username with special characters', () => {
            expect(() => username_vo_1.Username.create('john@doe')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('john-doe')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('john.doe')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('john!doe')).toThrow(exceptions_1.DomainException);
        });
        it('should throw error for username with hyphens', () => {
            expect(() => username_vo_1.Username.create('john-doe')).toThrow(exceptions_1.DomainException);
            expect(() => username_vo_1.Username.create('john-doe')).toThrow('Username can only contain letters, numbers, and underscores');
        });
    });
    describe('equals', () => {
        it('should return true for identical usernames', () => {
            const username1 = username_vo_1.Username.create('john_doe');
            const username2 = username_vo_1.Username.create('john_doe');
            expect(username1.equals(username2)).toBe(true);
        });
        it('should return false for different usernames', () => {
            const username1 = username_vo_1.Username.create('john_doe');
            const username2 = username_vo_1.Username.create('jane_doe');
            expect(username1.equals(username2)).toBe(false);
        });
        it('should return false when comparing to null', () => {
            const username = username_vo_1.Username.create('john_doe');
            expect(username.equals(null)).toBe(false);
        });
        it('should return false when comparing to undefined', () => {
            const username = username_vo_1.Username.create('john_doe');
            expect(username.equals(undefined)).toBe(false);
        });
    });
});
//# sourceMappingURL=username.vo.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_vo_1 = require("../email.vo");
const exceptions_1 = require("../../../../../shared/domain/exceptions");
describe('Email Value Object', () => {
    describe('create', () => {
        it('should create a valid email', () => {
            const email = email_vo_1.Email.create('user@example.com');
            expect(email.value).toBe('user@example.com');
        });
        it('should normalize email to lowercase', () => {
            const email = email_vo_1.Email.create('User@Example.COM');
            expect(email.value).toBe('user@example.com');
        });
        it('should trim whitespace', () => {
            const email = email_vo_1.Email.create('  user@example.com  ');
            expect(email.value).toBe('user@example.com');
        });
        it('should throw error for empty email', () => {
            expect(() => email_vo_1.Email.create('')).toThrow(exceptions_1.DomainException);
            expect(() => email_vo_1.Email.create('')).toThrow('Email cannot be empty');
        });
        it('should throw error for whitespace-only email', () => {
            expect(() => email_vo_1.Email.create('   ')).toThrow(exceptions_1.DomainException);
            expect(() => email_vo_1.Email.create('   ')).toThrow('Email cannot be empty');
        });
        it('should throw error for invalid email format - no @', () => {
            expect(() => email_vo_1.Email.create('userexample.com')).toThrow(exceptions_1.DomainException);
            expect(() => email_vo_1.Email.create('userexample.com')).toThrow('Invalid email format');
        });
        it('should throw error for invalid email format - no domain', () => {
            expect(() => email_vo_1.Email.create('user@')).toThrow(exceptions_1.DomainException);
            expect(() => email_vo_1.Email.create('user@')).toThrow('Invalid email format');
        });
        it('should throw error for invalid email format - no TLD', () => {
            expect(() => email_vo_1.Email.create('user@example')).toThrow(exceptions_1.DomainException);
            expect(() => email_vo_1.Email.create('user@example')).toThrow('Invalid email format');
        });
        it('should accept valid email with subdomain', () => {
            const email = email_vo_1.Email.create('user@mail.example.com');
            expect(email.value).toBe('user@mail.example.com');
        });
        it('should accept valid email with plus sign', () => {
            const email = email_vo_1.Email.create('user+tag@example.com');
            expect(email.value).toBe('user+tag@example.com');
        });
        it('should accept valid email with dots', () => {
            const email = email_vo_1.Email.create('first.last@example.com');
            expect(email.value).toBe('first.last@example.com');
        });
    });
    describe('equals', () => {
        it('should return true for identical emails', () => {
            const email1 = email_vo_1.Email.create('user@example.com');
            const email2 = email_vo_1.Email.create('user@example.com');
            expect(email1.equals(email2)).toBe(true);
        });
        it('should return true for emails with different casing', () => {
            const email1 = email_vo_1.Email.create('User@Example.COM');
            const email2 = email_vo_1.Email.create('user@example.com');
            expect(email1.equals(email2)).toBe(true);
        });
        it('should return false for different emails', () => {
            const email1 = email_vo_1.Email.create('user1@example.com');
            const email2 = email_vo_1.Email.create('user2@example.com');
            expect(email1.equals(email2)).toBe(false);
        });
        it('should return false when comparing to null', () => {
            const email = email_vo_1.Email.create('user@example.com');
            expect(email.equals(null)).toBe(false);
        });
        it('should return false when comparing to undefined', () => {
            const email = email_vo_1.Email.create('user@example.com');
            expect(email.equals(undefined)).toBe(false);
        });
    });
});
//# sourceMappingURL=email.vo.spec.js.map
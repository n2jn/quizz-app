"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_aggregate_1 = require("../user.aggregate");
const email_vo_1 = require("../../value-objects/email.vo");
const username_vo_1 = require("../../value-objects/username.vo");
const user_registered_event_1 = require("../../events/user-registered.event");
describe('User Aggregate', () => {
    const validEmail = email_vo_1.Email.create('user@example.com');
    const validUsername = username_vo_1.Username.create('john_doe');
    const validName = 'John Doe';
    const validPasswordHash = '$2b$12$hashedpassword';
    describe('create', () => {
        it('should create a new user with valid data', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.id).toBe('user-id-123');
            expect(user.getEmail()).toBe(validEmail);
            expect(user.getUsername()).toBe(validUsername);
            expect(user.getPasswordHash()).toBe(validPasswordHash);
            expect(user.getRole()).toBe(user_aggregate_1.UserRole.PLAYER);
        });
        it('should set role to PLAYER by default', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.getRole()).toBe(user_aggregate_1.UserRole.PLAYER);
        });
        it('should set createdAt and updatedAt timestamps', () => {
            const beforeCreate = new Date();
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            const afterCreate = new Date();
            expect(user.getCreatedAt()).toBeInstanceOf(Date);
            expect(user.getUpdatedAt()).toBeInstanceOf(Date);
            expect(user.getCreatedAt().getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
            expect(user.getCreatedAt().getTime()).toBeLessThanOrEqual(afterCreate.getTime());
        });
        it('should emit UserRegisteredEvent', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.domainEvents).toHaveLength(1);
            expect(user.domainEvents[0]).toBeInstanceOf(user_registered_event_1.UserRegisteredEvent);
            const event = user.domainEvents[0];
            expect(event.props.userId).toBe('user-id-123');
            expect(event.props.email).toBe('user@example.com');
            expect(event.props.username).toBe('john_doe');
        });
    });
    describe('fromPersistence', () => {
        it('should reconstitute user from persistence data', () => {
            const createdAt = new Date('2024-01-01');
            const updatedAt = new Date('2024-01-02');
            const user = user_aggregate_1.User.fromPersistence({
                id: 'user-id-123',
                email: validEmail,
                username: validUsername,
                name: validName,
                passwordHash: validPasswordHash,
                role: user_aggregate_1.UserRole.ADMIN,
                createdAt,
                updatedAt,
            });
            expect(user.id).toBe('user-id-123');
            expect(user.getEmail()).toBe(validEmail);
            expect(user.getUsername()).toBe(validUsername);
            expect(user.getPasswordHash()).toBe(validPasswordHash);
            expect(user.getRole()).toBe(user_aggregate_1.UserRole.ADMIN);
            expect(user.getCreatedAt()).toBe(createdAt);
            expect(user.getUpdatedAt()).toBe(updatedAt);
        });
        it('should not emit domain events when reconstituting', () => {
            const user = user_aggregate_1.User.fromPersistence({
                id: 'user-id-123',
                email: validEmail,
                username: validUsername,
                name: validName,
                passwordHash: validPasswordHash,
                role: user_aggregate_1.UserRole.PLAYER,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            expect(user.domainEvents).toHaveLength(0);
        });
    });
    describe('isAdmin', () => {
        it('should return true for ADMIN role', () => {
            const user = user_aggregate_1.User.fromPersistence({
                id: 'user-id-123',
                email: validEmail,
                username: validUsername,
                name: validName,
                passwordHash: validPasswordHash,
                role: user_aggregate_1.UserRole.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            expect(user.isAdmin()).toBe(true);
        });
        it('should return true for SUPER_ADMIN role', () => {
            const user = user_aggregate_1.User.fromPersistence({
                id: 'user-id-123',
                email: validEmail,
                username: validUsername,
                name: validName,
                passwordHash: validPasswordHash,
                role: user_aggregate_1.UserRole.SUPER_ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            expect(user.isAdmin()).toBe(true);
        });
        it('should return false for PLAYER role', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.isAdmin()).toBe(false);
        });
    });
    describe('isSuperAdmin', () => {
        it('should return true for SUPER_ADMIN role', () => {
            const user = user_aggregate_1.User.fromPersistence({
                id: 'user-id-123',
                email: validEmail,
                username: validUsername,
                name: validName,
                passwordHash: validPasswordHash,
                role: user_aggregate_1.UserRole.SUPER_ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            expect(user.isSuperAdmin()).toBe(true);
        });
        it('should return false for ADMIN role', () => {
            const user = user_aggregate_1.User.fromPersistence({
                id: 'user-id-123',
                email: validEmail,
                username: validUsername,
                name: validName,
                passwordHash: validPasswordHash,
                role: user_aggregate_1.UserRole.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            expect(user.isSuperAdmin()).toBe(false);
        });
        it('should return false for PLAYER role', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.isSuperAdmin()).toBe(false);
        });
    });
    describe('updatePassword', () => {
        it('should update password hash', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            const newPasswordHash = '$2b$12$newhashedpassword';
            user.updatePassword(newPasswordHash);
            expect(user.getPasswordHash()).toBe(newPasswordHash);
        });
        it('should update updatedAt timestamp', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            const originalUpdatedAt = user.getUpdatedAt();
            setTimeout(() => {
                user.updatePassword('$2b$12$newhashedpassword');
                expect(user.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
            }, 10);
        });
    });
    describe('clearEvents', () => {
        it('should clear all domain events', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.domainEvents).toHaveLength(1);
            user.clearEvents();
            expect(user.domainEvents).toHaveLength(0);
        });
    });
    describe('equals', () => {
        it('should return true for same user ID', () => {
            const user1 = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            const user2 = user_aggregate_1.User.fromPersistence({
                id: 'user-id-123',
                email: email_vo_1.Email.create('other@example.com'),
                username: username_vo_1.Username.create('other_user'),
                name: 'Other User',
                passwordHash: 'different',
                role: user_aggregate_1.UserRole.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            expect(user1.equals(user2)).toBe(true);
        });
        it('should return false for different user IDs', () => {
            const user1 = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            const user2 = user_aggregate_1.User.create('user-id-456', validEmail, validUsername, validName, validPasswordHash);
            expect(user1.equals(user2)).toBe(false);
        });
        it('should return false when comparing to null', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.equals(null)).toBe(false);
        });
        it('should return false when comparing to undefined', () => {
            const user = user_aggregate_1.User.create('user-id-123', validEmail, validUsername, validName, validPasswordHash);
            expect(user.equals(undefined)).toBe(false);
        });
    });
});
//# sourceMappingURL=user.aggregate.spec.js.map
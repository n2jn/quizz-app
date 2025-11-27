import { User, UserRole } from '../user.aggregate';
import { Email } from '../../value-objects/email.vo';
import { Username } from '../../value-objects/username.vo';
import { UserRegisteredEvent } from '../../events/user-registered.event';

describe('User Aggregate', () => {
  const validEmail = Email.create('user@example.com');
  const validUsername = Username.create('john_doe');
  const validPasswordHash = '$2b$12$hashedpassword';

  describe('create', () => {
    it('should create a new user with valid data', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);

      expect(user.id).toBe('user-id-123');
      expect(user.getEmail()).toBe(validEmail);
      expect(user.getUsername()).toBe(validUsername);
      expect(user.getPasswordHash()).toBe(validPasswordHash);
      expect(user.getRole()).toBe(UserRole.PLAYER);
    });

    it('should set role to PLAYER by default', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      expect(user.getRole()).toBe(UserRole.PLAYER);
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const beforeCreate = new Date();
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      const afterCreate = new Date();

      expect(user.getCreatedAt()).toBeInstanceOf(Date);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
      expect(user.getCreatedAt().getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(user.getCreatedAt().getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should emit UserRegisteredEvent', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);

      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0]).toBeInstanceOf(UserRegisteredEvent);

      const event = user.domainEvents[0] as UserRegisteredEvent;
      expect(event.props.userId).toBe('user-id-123');
      expect(event.props.email).toBe('user@example.com');
      expect(event.props.username).toBe('john_doe');
    });
  });

  describe('fromPersistence', () => {
    it('should reconstitute user from persistence data', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const user = User.fromPersistence({
        id: 'user-id-123',
        email: validEmail,
        username: validUsername,
        passwordHash: validPasswordHash,
        role: UserRole.ADMIN,
        createdAt,
        updatedAt,
      });

      expect(user.id).toBe('user-id-123');
      expect(user.getEmail()).toBe(validEmail);
      expect(user.getUsername()).toBe(validUsername);
      expect(user.getPasswordHash()).toBe(validPasswordHash);
      expect(user.getRole()).toBe(UserRole.ADMIN);
      expect(user.getCreatedAt()).toBe(createdAt);
      expect(user.getUpdatedAt()).toBe(updatedAt);
    });

    it('should not emit domain events when reconstituting', () => {
      const user = User.fromPersistence({
        id: 'user-id-123',
        email: validEmail,
        username: validUsername,
        passwordHash: validPasswordHash,
        role: UserRole.PLAYER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user.domainEvents).toHaveLength(0);
    });
  });

  describe('isAdmin', () => {
    it('should return true for ADMIN role', () => {
      const user = User.fromPersistence({
        id: 'user-id-123',
        email: validEmail,
        username: validUsername,
        passwordHash: validPasswordHash,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user.isAdmin()).toBe(true);
    });

    it('should return true for SUPER_ADMIN role', () => {
      const user = User.fromPersistence({
        id: 'user-id-123',
        email: validEmail,
        username: validUsername,
        passwordHash: validPasswordHash,
        role: UserRole.SUPER_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user.isAdmin()).toBe(true);
    });

    it('should return false for PLAYER role', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      expect(user.isAdmin()).toBe(false);
    });
  });

  describe('isSuperAdmin', () => {
    it('should return true for SUPER_ADMIN role', () => {
      const user = User.fromPersistence({
        id: 'user-id-123',
        email: validEmail,
        username: validUsername,
        passwordHash: validPasswordHash,
        role: UserRole.SUPER_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user.isSuperAdmin()).toBe(true);
    });

    it('should return false for ADMIN role', () => {
      const user = User.fromPersistence({
        id: 'user-id-123',
        email: validEmail,
        username: validUsername,
        passwordHash: validPasswordHash,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user.isSuperAdmin()).toBe(false);
    });

    it('should return false for PLAYER role', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      expect(user.isSuperAdmin()).toBe(false);
    });
  });

  describe('updatePassword', () => {
    it('should update password hash', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      const newPasswordHash = '$2b$12$newhashedpassword';

      user.updatePassword(newPasswordHash);

      expect(user.getPasswordHash()).toBe(newPasswordHash);
    });

    it('should update updatedAt timestamp', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      const originalUpdatedAt = user.getUpdatedAt();

      // Wait a bit to ensure timestamp changes
      setTimeout(() => {
        user.updatePassword('$2b$12$newhashedpassword');
        expect(user.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });
  });

  describe('clearEvents', () => {
    it('should clear all domain events', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);

      expect(user.domainEvents).toHaveLength(1);

      user.clearEvents();

      expect(user.domainEvents).toHaveLength(0);
    });
  });

  describe('equals', () => {
    it('should return true for same user ID', () => {
      const user1 = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      const user2 = User.fromPersistence({
        id: 'user-id-123',
        email: Email.create('other@example.com'),
        username: Username.create('other_user'),
        passwordHash: 'different',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for different user IDs', () => {
      const user1 = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      const user2 = User.create('user-id-456', validEmail, validUsername, validPasswordHash);

      expect(user1.equals(user2)).toBe(false);
    });

    it('should return false when comparing to null', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      expect(user.equals(null as any)).toBe(false);
    });

    it('should return false when comparing to undefined', () => {
      const user = User.create('user-id-123', validEmail, validUsername, validPasswordHash);
      expect(user.equals(undefined as any)).toBe(false);
    });
  });
});

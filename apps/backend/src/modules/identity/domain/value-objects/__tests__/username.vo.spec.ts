import { Username } from '../username.vo';
import { DomainException } from '@shared/domain/exceptions';

describe('Username Value Object', () => {
  describe('create', () => {
    it('should create a valid username', () => {
      const username = Username.create('john_doe');
      expect(username.value).toBe('john_doe');
    });

    it('should accept alphanumeric characters', () => {
      const username = Username.create('user123');
      expect(username.value).toBe('user123');
    });

    it('should accept underscores', () => {
      const username = Username.create('john_doe_123');
      expect(username.value).toBe('john_doe_123');
    });

    it('should trim whitespace', () => {
      const username = Username.create('  johndoe  ');
      expect(username.value).toBe('johndoe');
    });

    it('should accept minimum length username (3 chars)', () => {
      const username = Username.create('abc');
      expect(username.value).toBe('abc');
    });

    it('should accept maximum length username (20 chars)', () => {
      const username = Username.create('12345678901234567890');
      expect(username.value).toBe('12345678901234567890');
    });

    it('should throw error for empty username', () => {
      expect(() => Username.create('')).toThrow(DomainException);
      expect(() => Username.create('')).toThrow('Username cannot be empty');
    });

    it('should throw error for whitespace-only username', () => {
      expect(() => Username.create('   ')).toThrow(DomainException);
      expect(() => Username.create('   ')).toThrow('Username cannot be empty');
    });

    it('should throw error for username too short (< 3 chars)', () => {
      expect(() => Username.create('ab')).toThrow(DomainException);
      expect(() => Username.create('ab')).toThrow('Username must be at least 3 characters');
    });

    it('should throw error for username too long (> 20 chars)', () => {
      expect(() => Username.create('123456789012345678901')).toThrow(DomainException);
      expect(() => Username.create('123456789012345678901')).toThrow(
        'Username cannot exceed 20 characters',
      );
    });

    it('should throw error for username with spaces', () => {
      expect(() => Username.create('john doe')).toThrow(DomainException);
      expect(() => Username.create('john doe')).toThrow(
        'Username can only contain letters, numbers, and underscores',
      );
    });

    it('should throw error for username with special characters', () => {
      expect(() => Username.create('john@doe')).toThrow(DomainException);
      expect(() => Username.create('john-doe')).toThrow(DomainException);
      expect(() => Username.create('john.doe')).toThrow(DomainException);
      expect(() => Username.create('john!doe')).toThrow(DomainException);
    });

    it('should throw error for username with hyphens', () => {
      expect(() => Username.create('john-doe')).toThrow(DomainException);
      expect(() => Username.create('john-doe')).toThrow(
        'Username can only contain letters, numbers, and underscores',
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical usernames', () => {
      const username1 = Username.create('john_doe');
      const username2 = Username.create('john_doe');
      expect(username1.equals(username2)).toBe(true);
    });

    it('should return false for different usernames', () => {
      const username1 = Username.create('john_doe');
      const username2 = Username.create('jane_doe');
      expect(username1.equals(username2)).toBe(false);
    });

    it('should return false when comparing to null', () => {
      const username = Username.create('john_doe');
      expect(username.equals(null as any)).toBe(false);
    });

    it('should return false when comparing to undefined', () => {
      const username = Username.create('john_doe');
      expect(username.equals(undefined as any)).toBe(false);
    });
  });
});

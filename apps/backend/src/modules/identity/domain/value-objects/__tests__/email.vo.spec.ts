import { Email } from '../email.vo';
import { DomainException } from '@shared/domain/exceptions';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('user@example.com');
      expect(email.value).toBe('user@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('User@Example.COM');
      expect(email.value).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  user@example.com  ');
      expect(email.value).toBe('user@example.com');
    });

    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow(DomainException);
      expect(() => Email.create('')).toThrow('Email cannot be empty');
    });

    it('should throw error for whitespace-only email', () => {
      expect(() => Email.create('   ')).toThrow(DomainException);
      expect(() => Email.create('   ')).toThrow('Email cannot be empty');
    });

    it('should throw error for invalid email format - no @', () => {
      expect(() => Email.create('userexample.com')).toThrow(DomainException);
      expect(() => Email.create('userexample.com')).toThrow('Invalid email format');
    });

    it('should throw error for invalid email format - no domain', () => {
      expect(() => Email.create('user@')).toThrow(DomainException);
      expect(() => Email.create('user@')).toThrow('Invalid email format');
    });

    it('should throw error for invalid email format - no TLD', () => {
      expect(() => Email.create('user@example')).toThrow(DomainException);
      expect(() => Email.create('user@example')).toThrow('Invalid email format');
    });

    it('should accept valid email with subdomain', () => {
      const email = Email.create('user@mail.example.com');
      expect(email.value).toBe('user@mail.example.com');
    });

    it('should accept valid email with plus sign', () => {
      const email = Email.create('user+tag@example.com');
      expect(email.value).toBe('user+tag@example.com');
    });

    it('should accept valid email with dots', () => {
      const email = Email.create('first.last@example.com');
      expect(email.value).toBe('first.last@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for identical emails', () => {
      const email1 = Email.create('user@example.com');
      const email2 = Email.create('user@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return true for emails with different casing', () => {
      const email1 = Email.create('User@Example.COM');
      const email2 = Email.create('user@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('user1@example.com');
      const email2 = Email.create('user2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false when comparing to null', () => {
      const email = Email.create('user@example.com');
      expect(email.equals(null as any)).toBe(false);
    });

    it('should return false when comparing to undefined', () => {
      const email = Email.create('user@example.com');
      expect(email.equals(undefined as any)).toBe(false);
    });
  });
});

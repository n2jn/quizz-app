import { ValueObject } from '@shared/domain/base';
import { DomainException } from '@shared/domain/exceptions';

interface EmailProps {
  value: string;
}

/**
 * Email Value Object
 *
 * Ensures email addresses are valid and normalized.
 */
export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new DomainException('Email cannot be empty');
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!this.EMAIL_REGEX.test(normalizedEmail)) {
      throw new DomainException('Invalid email format');
    }

    return new Email({ value: normalizedEmail });
  }

  get value(): string {
    return this.props.value;
  }
}

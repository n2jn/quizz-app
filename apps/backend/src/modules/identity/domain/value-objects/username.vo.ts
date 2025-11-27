import { ValueObject } from '@shared/domain/base';
import { DomainException } from '@shared/domain/exceptions';

interface UsernameProps {
  value: string;
}

/**
 * Username Value Object
 *
 * Ensures usernames meet requirements (3-20 alphanumeric characters).
 */
export class Username extends ValueObject<UsernameProps> {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 20;
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

  private constructor(props: UsernameProps) {
    super(props);
  }

  static create(username: string): Username {
    if (!username || username.trim().length === 0) {
      throw new DomainException('Username cannot be empty');
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < this.MIN_LENGTH) {
      throw new DomainException(`Username must be at least ${this.MIN_LENGTH} characters`);
    }

    if (trimmedUsername.length > this.MAX_LENGTH) {
      throw new DomainException(`Username cannot exceed ${this.MAX_LENGTH} characters`);
    }

    if (!this.USERNAME_REGEX.test(trimmedUsername)) {
      throw new DomainException('Username can only contain letters, numbers, and underscores');
    }

    return new Username({ value: trimmedUsername });
  }

  get value(): string {
    return this.props.value;
  }
}

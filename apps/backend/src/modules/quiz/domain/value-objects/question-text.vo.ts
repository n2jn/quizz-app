import { ValueObject } from '@shared/domain/base/value-object.base';
import { InvalidArgumentException } from '@shared/domain/exceptions';

export interface QuestionTextProps {
  value: string;
}

/**
 * Question Text Value Object
 *
 * Ensures question text meets minimum quality standards:
 * - Minimum 10 characters
 * - Maximum 1000 characters
 * - Not empty or whitespace only
 */
export class QuestionText extends ValueObject<QuestionTextProps> {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 1000;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: QuestionTextProps) {
    super(props);
  }

  static create(text: string): QuestionText {
    const trimmed = text?.trim();

    if (!trimmed) {
      throw new InvalidArgumentException('Question text cannot be empty');
    }

    if (trimmed.length < this.MIN_LENGTH) {
      throw new InvalidArgumentException(
        `Question text must be at least ${this.MIN_LENGTH} characters`,
      );
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new InvalidArgumentException(
        `Question text must not exceed ${this.MAX_LENGTH} characters`,
      );
    }

    return new QuestionText({ value: trimmed });
  }
}

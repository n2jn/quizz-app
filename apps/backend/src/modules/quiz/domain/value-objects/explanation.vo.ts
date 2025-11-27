import { ValueObject } from '@shared/domain/base/value-object.base';
import { InvalidArgumentException } from '@shared/domain/exceptions';

export interface ExplanationProps {
  value: string;
}

/**
 * Explanation Value Object
 *
 * Represents the explanation text for a quiz question.
 * Ensures educational value by requiring minimum length.
 */
export class Explanation extends ValueObject<ExplanationProps> {
  private static readonly MIN_LENGTH = 20;
  private static readonly MAX_LENGTH = 2000;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ExplanationProps) {
    super(props);
  }

  static create(text: string): Explanation {
    const trimmed = text?.trim();

    if (!trimmed) {
      throw new InvalidArgumentException('Explanation cannot be empty');
    }

    if (trimmed.length < this.MIN_LENGTH) {
      throw new InvalidArgumentException(
        `Explanation must be at least ${this.MIN_LENGTH} characters`,
      );
    }

    if (trimmed.length > this.MAX_LENGTH) {
      throw new InvalidArgumentException(
        `Explanation must not exceed ${this.MAX_LENGTH} characters`,
      );
    }

    return new Explanation({ value: trimmed });
  }
}

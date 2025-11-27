import { Entity } from '@shared/domain/base/entity.base';

export interface AnswerProps {
  id: string;
  text: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Answer Entity
 *
 * Represents a possible answer to a quiz question.
 * Part of the Question aggregate.
 */
export class Answer extends Entity<string> {
  private constructor(private readonly props: AnswerProps) {
    super(props.id);
  }

  get text(): string {
    return this.props.text;
  }

  get isCorrect(): boolean {
    return this.props.isCorrect;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    id: string,
    text: string,
    isCorrect: boolean,
  ): Answer {
    if (!text || text.trim().length === 0) {
      throw new Error('Answer text cannot be empty');
    }

    if (text.length > 255) {
      throw new Error('Answer text must not exceed 255 characters');
    }

    return new Answer({
      id,
      text: text.trim(),
      isCorrect,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: AnswerProps): Answer {
    return new Answer(props);
  }
}

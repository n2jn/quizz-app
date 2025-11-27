import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
import { QuestionText } from '../value-objects/question-text.vo';
import { Explanation } from '../value-objects/explanation.vo';
import { Answer } from '../entities/answer.entity';
import { QuestionCreatedEvent } from '../events/question-created.event';

export enum QuestionStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface QuestionProps {
  id: string;
  text: QuestionText;
  explanation: Explanation;
  imageUrl: string | null;
  categoryId: string;
  difficultyId: string;
  status: QuestionStatus;
  createdById: string;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Question Aggregate Root
 *
 * Represents a quiz question with multiple choice answers.
 * Enforces business rules:
 * - Must have 2-6 answers
 * - Exactly one answer must be correct
 * - Can only be published if it has valid answers
 */
export class Question extends AggregateRoot<string> {
  private static readonly MIN_ANSWERS = 2;
  private static readonly MAX_ANSWERS = 6;

  private constructor(private props: QuestionProps) {
    super(props.id);
  }

  get text(): QuestionText {
    return this.props.text;
  }

  get explanation(): Explanation {
    return this.props.explanation;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get difficultyId(): string {
    return this.props.difficultyId;
  }

  get status(): QuestionStatus {
    return this.props.status;
  }

  get createdById(): string {
    return this.props.createdById;
  }

  get answers(): readonly Answer[] {
    return this.props.answers;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    id: string,
    text: QuestionText,
    explanation: Explanation,
    categoryId: string,
    difficultyId: string,
    createdById: string,
    answers: Answer[],
    imageUrl: string | null = null,
  ): Question {
    // Validate answers
    if (answers.length < this.MIN_ANSWERS || answers.length > this.MAX_ANSWERS) {
      throw new Error(
        `Question must have between ${this.MIN_ANSWERS} and ${this.MAX_ANSWERS} answers`,
      );
    }

    const correctAnswers = answers.filter((a) => a.isCorrect);
    if (correctAnswers.length !== 1) {
      throw new Error('Question must have exactly one correct answer');
    }

    const question = new Question({
      id,
      text,
      explanation,
      imageUrl,
      categoryId,
      difficultyId,
      status: QuestionStatus.DRAFT,
      createdById,
      answers,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    question.addDomainEvent(
      new QuestionCreatedEvent({
        questionId: id,
        categoryId,
        difficultyId,
        createdById,
        occurredAt: new Date(),
      }),
    );

    return question;
  }

  publish(): void {
    if (this.props.status === QuestionStatus.PUBLISHED) {
      throw new Error('Question is already published');
    }

    if (this.props.status === QuestionStatus.ARCHIVED) {
      throw new Error('Cannot publish archived question');
    }

    this.props.status = QuestionStatus.PUBLISHED;
    this.props.updatedAt = new Date();
  }

  archive(): void {
    if (this.props.status === QuestionStatus.ARCHIVED) {
      throw new Error('Question is already archived');
    }

    this.props.status = QuestionStatus.ARCHIVED;
    this.props.updatedAt = new Date();
  }

  isPublished(): boolean {
    return this.props.status === QuestionStatus.PUBLISHED;
  }

  static fromPersistence(props: QuestionProps): Question {
    return new Question(props);
  }
}

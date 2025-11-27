import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
import { QuizSessionStartedEvent } from '../events/quiz-session-started.event';
import { QuizSessionCompletedEvent } from '../events/quiz-session-completed.event';

export enum SessionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export interface SessionAnswerData {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
  timeBonus: number;
}

export interface QuizSessionProps {
  id: string;
  userId: string;
  categoryId: string | null;
  difficultyId: string;
  status: SessionStatus;
  score: number;
  answers: SessionAnswerData[];
  startedAt: Date;
  completedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quiz Session Aggregate Root
 *
 * Manages a player's quiz session lifecycle.
 * Business rules:
 * - Session expires after configured time
 * - Cannot submit answers after completion/expiration
 * - Score calculated based on correct answers and time bonuses
 */
export class QuizSession extends AggregateRoot<string> {
  private constructor(private props: QuizSessionProps) {
    super(props.id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get categoryId(): string | null {
    return this.props.categoryId;
  }

  get difficultyId(): string {
    return this.props.difficultyId;
  }

  get status(): SessionStatus {
    return this.props.status;
  }

  get score(): number {
    return this.props.score;
  }

  get answers(): readonly SessionAnswerData[] {
    return this.props.answers;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    id: string,
    userId: string,
    categoryId: string | null,
    difficultyId: string,
    sessionDurationMinutes: number,
  ): QuizSession {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionDurationMinutes * 60 * 1000);

    const session = new QuizSession({
      id,
      userId,
      categoryId,
      difficultyId,
      status: SessionStatus.IN_PROGRESS,
      score: 0,
      answers: [],
      startedAt: now,
      completedAt: null,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    session.addDomainEvent(
      new QuizSessionStartedEvent({
        sessionId: id,
        userId,
        categoryId,
        difficultyId,
        occurredAt: now,
      }),
    );

    return session;
  }

  submitAnswer(answer: SessionAnswerData): void {
    if (this.props.status !== SessionStatus.IN_PROGRESS) {
      throw new Error('Cannot submit answer for completed or abandoned session');
    }

    if (new Date() > this.props.expiresAt) {
      this.abandon();
      throw new Error('Session has expired');
    }

    // Check if answer already submitted for this question
    const existingAnswer = this.props.answers.find(
      (a) => a.questionId === answer.questionId,
    );
    if (existingAnswer) {
      throw new Error('Answer already submitted for this question');
    }

    this.props.answers.push(answer);
    this.props.score += answer.pointsEarned + answer.timeBonus;
    this.props.updatedAt = new Date();
  }

  complete(): void {
    if (this.props.status !== SessionStatus.IN_PROGRESS) {
      throw new Error('Session is not in progress');
    }

    const now = new Date();
    this.props.status = SessionStatus.COMPLETED;
    this.props.completedAt = now;
    this.props.updatedAt = now;

    const correctAnswers = this.props.answers.filter((a) => a.isCorrect).length;
    const totalPoints = this.props.answers.reduce(
      (sum, a) => sum + a.pointsEarned + a.timeBonus,
      0,
    );

    this.addDomainEvent(
      new QuizSessionCompletedEvent({
        sessionId: this.props.id,
        userId: this.props.userId,
        categoryId: this.props.categoryId,
        difficultyId: this.props.difficultyId,
        score: this.props.score,
        totalQuestions: this.props.answers.length,
        correctAnswers,
        totalPoints,
        occurredAt: now,
      }),
    );
  }

  abandon(): void {
    if (this.props.status !== SessionStatus.IN_PROGRESS) {
      throw new Error('Session is not in progress');
    }

    this.props.status = SessionStatus.ABANDONED;
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  isInProgress(): boolean {
    return this.props.status === SessionStatus.IN_PROGRESS && !this.isExpired();
  }

  static fromPersistence(props: QuizSessionProps): QuizSession {
    return new QuizSession(props);
  }
}

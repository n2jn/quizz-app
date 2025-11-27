import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface QuizSessionCompletedEventProps {
  sessionId: string;
  userId: string;
  categoryId: string | null;
  difficultyId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  occurredAt: Date;
}

/**
 * Quiz Session Completed Domain Event
 *
 * Published when a player completes a quiz session.
 * Triggers gamification updates (XP, streak, badges, etc.)
 */
export class QuizSessionCompletedEvent extends DomainEvent {
  constructor(public readonly props: QuizSessionCompletedEventProps) {
    super('quiz.session.completed');
  }

  get sessionId(): string {
    return this.props.sessionId;
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

  get score(): number {
    return this.props.score;
  }

  get totalQuestions(): number {
    return this.props.totalQuestions;
  }

  get correctAnswers(): number {
    return this.props.correctAnswers;
  }

  get totalPoints(): number {
    return this.props.totalPoints;
  }

  get isPerfectScore(): boolean {
    return this.props.correctAnswers === this.props.totalQuestions;
  }
}

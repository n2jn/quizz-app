import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface QuizSessionStartedEventProps {
  sessionId: string;
  userId: string;
  categoryId: string | null;
  difficultyId: string;
  occurredAt: Date;
}

/**
 * Quiz Session Started Domain Event
 *
 * Published when a player starts a new quiz session.
 */
export class QuizSessionStartedEvent extends DomainEvent {
  constructor(public readonly props: QuizSessionStartedEventProps) {
    super('quiz.session.started');
  }

  getAggregateId(): string {
    return this.props.sessionId;
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
}

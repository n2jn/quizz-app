import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface LifeConsumedEventProps {
  userId: string;
  livesRemaining: number;
  occurredAt: Date;
}

/**
 * Life Consumed Domain Event
 *
 * Published when a player uses a life to start a quiz.
 */
export class LifeConsumedEvent extends DomainEvent {
  constructor(public readonly props: LifeConsumedEventProps) {
    super('life.consumed');
  }

  get userId(): string {
    return this.props.userId;
  }

  get livesRemaining(): number {
    return this.props.livesRemaining;
  }
}

import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface LifeRestoredEventProps {
  userId: string;
  livesRemaining: number;
  isPurchased: boolean;
  occurredAt: Date;
}

/**
 * Life Restored Domain Event
 *
 * Published when a life is restored (regeneration or purchase).
 */
export class LifeRestoredEvent extends DomainEvent {
  constructor(public readonly props: LifeRestoredEventProps) {
    super('life.restored');
  }

  getAggregateId(): string {
    return this.props.userId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get livesRemaining(): number {
    return this.props.livesRemaining;
  }

  get isPurchased(): boolean {
    return this.props.isPurchased;
  }
}

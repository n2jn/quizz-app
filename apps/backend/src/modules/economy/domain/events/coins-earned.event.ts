import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface CoinsEarnedEventProps {
  userId: string;
  amount: number;
  source: string;
  description: string | null;
  balanceAfter: number;
  occurredAt: Date;
}

/**
 * Coins Earned Domain Event
 *
 * Published when a player earns coins.
 */
export class CoinsEarnedEvent extends DomainEvent {
  constructor(public readonly props: CoinsEarnedEventProps) {
    super('coins.earned');
  }

  get userId(): string {
    return this.props.userId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get source(): string {
    return this.props.source;
  }

  get balanceAfter(): number {
    return this.props.balanceAfter;
  }
}

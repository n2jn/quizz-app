import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface CoinsSpentEventProps {
  userId: string;
  amount: number;
  source: string;
  description: string | null;
  balanceAfter: number;
  occurredAt: Date;
}

/**
 * Coins Spent Domain Event
 *
 * Published when a player spends coins.
 */
export class CoinsSpentEvent extends DomainEvent {
  constructor(public readonly props: CoinsSpentEventProps) {
    super('coins.spent');
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

import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface LevelUpEventProps {
  userId: string;
  newLevel: number;
  totalXP: number;
  occurredAt: Date;
}

export class LevelUpEvent extends DomainEvent {
  constructor(public readonly props: LevelUpEventProps) {
    super('player.level_up');
  }

  getAggregateId(): string {
    return this.props.userId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get newLevel(): number {
    return this.props.newLevel;
  }
}

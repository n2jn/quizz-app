import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface StreakUpdatedEventProps {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  occurredAt: Date;
}

export class StreakUpdatedEvent extends DomainEvent {
  constructor(public readonly props: StreakUpdatedEventProps) {
    super('player.streak_updated');
  }

  get userId(): string {
    return this.props.userId;
  }

  get currentStreak(): number {
    return this.props.currentStreak;
  }
}

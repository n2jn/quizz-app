import { DomainEvent } from '@shared/domain/base';

export interface UserRegisteredEventProps {
  userId: string;
  email: string;
  username: string;
}

/**
 * UserRegisteredEvent
 *
 * Emitted when a new user successfully registers.
 * Other contexts listen to this to initialize user data (wallet, lives, progress).
 */
export class UserRegisteredEvent extends DomainEvent {
  constructor(public readonly props: UserRegisteredEventProps) {
    super('user.registered');
  }

  getAggregateId(): string {
    return this.props.userId;
  }
}

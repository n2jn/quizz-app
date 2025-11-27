import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
import { CoinsEarnedEvent } from '../events/coins-earned.event';
import { CoinsSpentEvent } from '../events/coins-spent.event';

export enum TransactionType {
  EARNED = 'EARNED',
  SPENT = 'SPENT',
}

export interface TransactionData {
  type: TransactionType;
  amount: number;
  source: string;
  description: string | null;
  balanceAfter: number;
  createdAt: Date;
}

export interface WalletProps {
  id: string;
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Wallet Aggregate Root
 *
 * Manages player's coin economy.
 * Business rules:
 * - Balance cannot go negative
 * - All transactions must be tracked
 * - Lifetime stats are immutable (only increase)
 */
export class Wallet extends AggregateRoot<string> {
  private constructor(private props: WalletProps) {
    super(props.id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get balance(): number {
    return this.props.balance;
  }

  get lifetimeEarned(): number {
    return this.props.lifetimeEarned;
  }

  get lifetimeSpent(): number {
    return this.props.lifetimeSpent;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(id: string, userId: string): Wallet {
    return new Wallet({
      id,
      userId,
      balance: 0,
      lifetimeEarned: 0,
      lifetimeSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  addCoins(amount: number, source: string, description?: string): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    this.props.balance += amount;
    this.props.lifetimeEarned += amount;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new CoinsEarnedEvent({
        userId: this.props.userId,
        amount,
        source,
        description: description || null,
        balanceAfter: this.props.balance,
        occurredAt: new Date(),
      }),
    );
  }

  spendCoins(amount: number, source: string, description?: string): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (this.props.balance < amount) {
      throw new Error('Insufficient balance');
    }

    this.props.balance -= amount;
    this.props.lifetimeSpent += amount;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new CoinsSpentEvent({
        userId: this.props.userId,
        amount,
        source,
        description: description || null,
        balanceAfter: this.props.balance,
        occurredAt: new Date(),
      }),
    );
  }

  hasBalance(amount: number): boolean {
    return this.props.balance >= amount;
  }

  static fromPersistence(props: WalletProps): Wallet {
    return new Wallet(props);
  }
}

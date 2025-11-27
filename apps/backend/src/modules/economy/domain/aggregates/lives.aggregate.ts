import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
import { LifeConsumedEvent } from '../events/life-consumed.event';
import { LifeRestoredEvent } from '../events/life-restored.event';

export interface LivesProps {
  id: string;
  userId: string;
  currentLives: number;
  maxLives: number;
  lastRegenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lives Aggregate Root
 *
 * Manages player's lives (hearts) system.
 * Business rules:
 * - Lives regenerate over time (1 life per 30 minutes)
 * - Cannot exceed max lives from regeneration
 * - Can purchase lives to exceed max temporarily
 * - Minimum 0 lives
 */
export class Lives extends AggregateRoot<string> {
  private static readonly REGEN_INTERVAL_MINUTES = 30;

  private constructor(private props: LivesProps) {
    super(props.id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get currentLives(): number {
    return this.props.currentLives;
  }

  get maxLives(): number {
    return this.props.maxLives;
  }

  get lastRegenAt(): Date | null {
    return this.props.lastRegenAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(id: string, userId: string, maxLives: number = 5): Lives {
    return new Lives({
      id,
      userId,
      currentLives: maxLives,
      maxLives,
      lastRegenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  consumeLife(): void {
    if (this.props.currentLives <= 0) {
      throw new Error('No lives available');
    }

    this.props.currentLives -= 1;
    this.props.updatedAt = new Date();

    // Start regeneration timer if lives drop below max
    if (this.props.currentLives < this.props.maxLives && !this.props.lastRegenAt) {
      this.props.lastRegenAt = new Date();
    }

    this.addDomainEvent(
      new LifeConsumedEvent({
        userId: this.props.userId,
        livesRemaining: this.props.currentLives,
        occurredAt: new Date(),
      }),
    );
  }

  restoreLife(isPurchased: boolean = false): void {
    // If purchased, can exceed max lives
    if (!isPurchased && this.props.currentLives >= this.props.maxLives) {
      throw new Error('Lives already at maximum');
    }

    this.props.currentLives += 1;
    this.props.updatedAt = new Date();

    // Stop regeneration timer if at max
    if (this.props.currentLives >= this.props.maxLives) {
      this.props.lastRegenAt = null;
    } else {
      // Continue regeneration timer
      this.props.lastRegenAt = new Date();
    }

    this.addDomainEvent(
      new LifeRestoredEvent({
        userId: this.props.userId,
        livesRemaining: this.props.currentLives,
        isPurchased,
        occurredAt: new Date(),
      }),
    );
  }

  regenerateLives(): number {
    if (this.props.currentLives >= this.props.maxLives) {
      return 0; // No regeneration needed
    }

    if (!this.props.lastRegenAt) {
      return 0; // No regeneration in progress
    }

    const now = new Date();
    const minutesSinceRegen =
      (now.getTime() - this.props.lastRegenAt.getTime()) / (1000 * 60);
    const livesToRestore = Math.floor(minutesSinceRegen / Lives.REGEN_INTERVAL_MINUTES);

    if (livesToRestore === 0) {
      return 0;
    }

    const actualRestore = Math.min(
      livesToRestore,
      this.props.maxLives - this.props.currentLives,
    );

    for (let i = 0; i < actualRestore; i++) {
      this.restoreLife(false);
    }

    return actualRestore;
  }

  hasLives(): boolean {
    return this.props.currentLives > 0;
  }

  static fromPersistence(props: LivesProps): Lives {
    return new Lives(props);
  }
}

import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
import { LevelUpEvent } from '../events/level-up.event';
import { StreakUpdatedEvent } from '../events/streak-updated.event';

export interface PlayerProgressProps {
  id: string;
  userId: string;
  currentXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalQuizzes: number;
  perfectQuizzes: number;
  totalCorrect: number;
  totalAnswers: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Player Progress Aggregate Root
 *
 * Manages player's gamification progress.
 * Business rules:
 * - XP increases with quiz completion
 * - Level up at 1000 XP intervals
 * - Streak increases with daily quiz completion
 */
export class PlayerProgress extends AggregateRoot<string> {
  private static readonly XP_PER_LEVEL = 1000;

  private constructor(private props: PlayerProgressProps) {
    super(props.id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get currentXP(): number {
    return this.props.currentXP;
  }

  get currentLevel(): number {
    return this.props.currentLevel;
  }

  get currentStreak(): number {
    return this.props.currentStreak;
  }

  get longestStreak(): number {
    return this.props.longestStreak;
  }

  get totalQuizzes(): number {
    return this.props.totalQuizzes;
  }

  get perfectQuizzes(): number {
    return this.props.perfectQuizzes;
  }

  get totalCorrect(): number {
    return this.props.totalCorrect;
  }

  get totalAnswers(): number {
    return this.props.totalAnswers;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(id: string, userId: string): PlayerProgress {
    return new PlayerProgress({
      id,
      userId,
      currentXP: 0,
      currentLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalQuizzes: 0,
      perfectQuizzes: 0,
      totalCorrect: 0,
      totalAnswers: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  addXP(amount: number): void {
    if (amount <= 0) return;

    this.props.currentXP += amount;
    this.props.updatedAt = new Date();

    // Check for level up
    const newLevel = Math.floor(this.props.currentXP / PlayerProgress.XP_PER_LEVEL) + 1;
    if (newLevel > this.props.currentLevel) {
      this.props.currentLevel = newLevel;
      this.addDomainEvent(
        new LevelUpEvent({
          userId: this.props.userId,
          newLevel: newLevel,
          totalXP: this.props.currentXP,
          occurredAt: new Date(),
        }),
      );
    }
  }

  recordQuizCompletion(correctAnswers: number, totalQuestions: number): void {
    this.props.totalQuizzes += 1;
    this.props.totalCorrect += correctAnswers;
    this.props.totalAnswers += totalQuestions;

    if (correctAnswers === totalQuestions) {
      this.props.perfectQuizzes += 1;
    }

    this.props.updatedAt = new Date();
  }

  incrementStreak(): void {
    this.props.currentStreak += 1;

    if (this.props.currentStreak > this.props.longestStreak) {
      this.props.longestStreak = this.props.currentStreak;
    }

    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new StreakUpdatedEvent({
        userId: this.props.userId,
        currentStreak: this.props.currentStreak,
        longestStreak: this.props.longestStreak,
        occurredAt: new Date(),
      }),
    );
  }

  resetStreak(): void {
    this.props.currentStreak = 0;
    this.props.updatedAt = new Date();
  }

  get accuracy(): number {
    if (this.props.totalAnswers === 0) return 0;
    return (this.props.totalCorrect / this.props.totalAnswers) * 100;
  }

  static fromPersistence(props: PlayerProgressProps): PlayerProgress {
    return new PlayerProgress(props);
  }
}

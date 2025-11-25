# ⏰ Background Jobs & Cron Schedules

This document specifies all background jobs, cron schedules, and async task processing for PastryQuiz.

---

## Technology Stack

```yaml
Scheduler: @nestjs/schedule
Queue (future): Bull + Redis
Timezone: UTC (server) + User timezone for streak calculations
```

---

## Job Overview

| Job Name | Schedule | Priority | Estimated Runtime | Description |
|----------|----------|----------|-------------------|-------------|
| Life Regeneration | Every 5 min | High | <1s per batch | Regenerate lives for players |
| Streak Update | Daily 00:00 UTC | High | 5-10s | Update/reset streaks, consume protections |
| Session Cleanup | Every 5 min | Medium | <1s | Mark expired sessions as abandoned |
| Leaderboard Reset | Weekly Mon 00:00 UTC | Medium | 2-5s | Reset weekly scores |
| Leaderboard Recalc | Every 10 min | Low | 2-5s | Recalculate global/weekly ranks |
| Badge Evaluation | On-demand (event-driven) | Medium | <500ms | Check badge unlock conditions |

---

## 1. Life Regeneration Job

### Purpose
Regenerate lives for players at a rate of **1 life per 30 minutes** until max (5 lives).

### Schedule
```typescript
@Cron('*/5 * * * *') // Every 5 minutes
```

### Implementation

```typescript
// cron/jobs/life-regen.job.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LifeRegenerationJob {
  private readonly logger = new Logger(LifeRegenerationJob.name);

  constructor(
    private readonly livesRepo: ILivesRepository,
    private readonly eventBus: EventBus,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async regenerateLives(): Promise<void> {
    const startTime = Date.now();
    this.logger.log('Starting life regeneration job');

    try {
      // Find all players with less than max lives
      const playersNeedingRegen = await this.livesRepo.findNeedingRegeneration();

      this.logger.log(`Found ${playersNeedingRegen.length} players needing regeneration`);

      let regeneratedCount = 0;

      for (const lives of playersNeedingRegen) {
        try {
          const hadRegen = lives.currentLives < lives.maxLives;

          // Regenerate (domain logic handles timing)
          lives.regenerateLives();

          if (lives.events.length > 0) {
            regeneratedCount++;
            await this.livesRepo.save(lives);
            this.eventBus.publishAll(lives.events);
            lives.clearEvents();
          }
        } catch (error) {
          this.logger.error(
            `Failed to regenerate lives for user ${lives.userId}`,
            error,
          );
          // Continue with next player
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Life regeneration completed. Regenerated: ${regeneratedCount}, Duration: ${duration}ms`,
      );
    } catch (error) {
      this.logger.error('Life regeneration job failed', error);
      throw error;
    }
  }
}
```

### Query for Finding Players

```typescript
// infrastructure/persistence/lives.repository.ts
async findNeedingRegeneration(): Promise<Lives[]> {
  // Players with:
  // - currentLives < maxLives
  // - lastRegenAt is set (means they've started regenerating)

  const livesRecords = await this.prisma.lives.findMany({
    where: {
      currentLives: { lt: this.prisma.lives.fields.maxLives },
      lastRegenAt: { not: null },
    },
  });

  return livesRecords.map(record => this.toDomain(record));
}
```

### Domain Logic

```typescript
// economy/domain/aggregates/lives.aggregate.ts
regenerateLives(): void {
  if (this.currentLives >= this.maxLives) {
    this.lastRegenAt = null;
    return; // Already at max
  }

  if (!this.lastRegenAt) {
    // First time dropping below max
    this.lastRegenAt = new Date();
    return;
  }

  const now = new Date();
  const minutesSinceLastRegen = (now.getTime() - this.lastRegenAt.getTime()) / (1000 * 60);
  const livesToRegen = Math.floor(minutesSinceLastRegen / this.REGEN_MINUTES); // 30

  if (livesToRegen > 0) {
    const newLives = Math.min(this.maxLives, this.currentLives + livesToRegen);
    const actuallyRegenerated = newLives - this.currentLives;

    if (actuallyRegenerated > 0) {
      this.currentLives = newLives;

      // Update lastRegenAt by the time consumed
      this.lastRegenAt = new Date(
        this.lastRegenAt.getTime() + actuallyRegenerated * this.REGEN_MINUTES * 60 * 1000,
      );

      this.addDomainEvent(new LifeRegeneratedEvent(this.userId, this.currentLives));
    }

    if (this.currentLives >= this.maxLives) {
      this.lastRegenAt = null; // Stop regenerating
    }
  }
}
```

### Example Scenarios

**Scenario 1: Player with 2/5 lives, last regen 40 minutes ago**
- 40 minutes / 30 minutes per life = 1 life regenerated
- New lives: 3/5
- Last regen updated to 10 minutes ago (40 - 30)

**Scenario 2: Player with 4/5 lives, last regen 60 minutes ago**
- 60 minutes / 30 minutes per life = 2 lives to regen
- But max is 5, so only +1 life
- New lives: 5/5
- Last regen set to null (at max)

---

## 2. Streak Update Job

### Purpose
- Check if players played today
- Reset streak if they missed a day (and have no protection)
- Consume streak protections if used

### Schedule
```typescript
@Cron('0 0 * * *', { timeZone: 'UTC' })
// Daily at midnight UTC
```

### Implementation

```typescript
// cron/jobs/streak-update.job.ts
@Injectable()
export class StreakUpdateJob {
  private readonly logger = new Logger(StreakUpdateJob.name);

  constructor(
    private readonly progressRepo: IPlayerProgressRepository,
    private readonly protectionRepo: IStreakProtectionRepository,
    private readonly streakCalculator: StreakCalculator,
    private readonly eventBus: EventBus,
  ) {}

  @Cron('0 0 * * *', { timeZone: 'UTC' })
  async updateStreaks(): Promise<void> {
    this.logger.log('Starting daily streak update');

    try {
      const allProgress = await this.progressRepo.findAll();

      let streaksReset = 0;
      let protectionsConsumed = 0;

      for (const progress of allProgress) {
        try {
          const hasProtection = await this.hasActiveProtection(progress.userId);

          // Check if streak should be reset
          if (this.streakCalculator.shouldResetStreak(progress.lastPlayedAt, hasProtection)) {
            if (hasProtection) {
              // Consume protection instead of resetting
              await this.consumeProtection(progress.userId);
              protectionsConsumed++;
              this.logger.log(`Consumed protection for user ${progress.userId}`);
            } else {
              // Reset streak
              const oldStreak = progress.currentStreak;
              progress.resetStreak();
              await this.progressRepo.save(progress);

              this.eventBus.publish(new StreakLostEvent(progress.userId, oldStreak));
              streaksReset++;
              this.logger.log(`Reset streak for user ${progress.userId} (was ${oldStreak})`);
            }
          }
        } catch (error) {
          this.logger.error(`Failed to update streak for user ${progress.userId}`, error);
        }
      }

      this.logger.log(
        `Streak update completed. Reset: ${streaksReset}, Protected: ${protectionsConsumed}`,
      );
    } catch (error) {
      this.logger.error('Streak update job failed', error);
      throw error;
    }
  }

  private async hasActiveProtection(userId: string): Promise<boolean> {
    const protections = await this.protectionRepo.findActiveByUserId(userId);
    return protections.length > 0;
  }

  private async consumeProtection(userId: string): Promise<void> {
    const protections = await this.protectionRepo.findActiveByUserId(userId);

    if (protections.length > 0) {
      // Consume oldest protection first
      const protection = protections[0];
      await this.protectionRepo.delete(protection.id);

      this.eventBus.publish(new StreakProtectionConsumedEvent(userId, protection.id));
    }
  }
}
```

### Streak Calculator (Domain Service)

```typescript
// gamification/domain/services/streak-calculator.service.ts
@Injectable()
export class StreakCalculator {
  /**
   * Returns true if streak should be reset (player missed yesterday)
   */
  shouldResetStreak(lastPlayedAt: Date, hasProtection: boolean): boolean {
    if (hasProtection) {
      // Protection prevents reset, but this method still returns true
      // so the job knows to consume the protection
      return this.missedYesterday(lastPlayedAt);
    }

    return this.missedYesterday(lastPlayedAt);
  }

  private missedYesterday(lastPlayedAt: Date): boolean {
    const yesterday = this.startOfDay(this.subtractDays(new Date(), 1));
    const lastPlayed = this.startOfDay(lastPlayedAt);

    // If last played before yesterday, they missed a day
    return lastPlayed.getTime() < yesterday.getTime();
  }

  hasPlayedToday(lastPlayedAt: Date): boolean {
    const today = this.startOfDay(new Date());
    const lastPlayed = this.startOfDay(lastPlayedAt);
    return today.getTime() === lastPlayed.getTime();
  }

  shouldIncrementStreak(lastPlayedAt: Date): boolean {
    const yesterday = this.startOfDay(this.subtractDays(new Date(), 1));
    const lastPlayed = this.startOfDay(lastPlayedAt);
    return yesterday.getTime() === lastPlayed.getTime();
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private subtractDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
  }
}
```

### Finding Active Protections

```typescript
// gamification/infrastructure/persistence/streak-protection.repository.ts
async findActiveByUserId(userId: string): Promise<StreakProtection[]> {
  const now = new Date();

  const records = await this.prisma.streakProtection.findMany({
    where: {
      userId,
      expiresAt: { gt: now },
    },
    orderBy: {
      createdAt: 'asc', // Oldest first
    },
  });

  return records.map(r => this.toDomain(r));
}
```

---

## 3. Session Cleanup Job

### Purpose
Mark expired quiz sessions as `ABANDONED` to keep database clean.

### Schedule
```typescript
@Cron('*/5 * * * *') // Every 5 minutes
```

### Implementation

```typescript
// cron/jobs/session-cleanup.job.ts
@Injectable()
export class SessionCleanupJob {
  private readonly logger = new Logger(SessionCleanupJob.name);

  constructor(
    private readonly sessionRepo: IQuizSessionRepository,
    private readonly eventBus: EventBus,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupExpiredSessions(): Promise<void> {
    this.logger.log('Starting session cleanup');

    try {
      const expiredSessions = await this.sessionRepo.findExpired();

      this.logger.log(`Found ${expiredSessions.length} expired sessions`);

      let cleanedCount = 0;

      for (const session of expiredSessions) {
        try {
          if (session.status === 'IN_PROGRESS') {
            session.abandon('expired');
            await this.sessionRepo.save(session);

            this.eventBus.publish(
              new QuizAbandonedEvent(session.id, session.userId, 'expired'),
            );

            cleanedCount++;
          }
        } catch (error) {
          this.logger.error(`Failed to cleanup session ${session.id}`, error);
        }
      }

      this.logger.log(`Cleaned up ${cleanedCount} sessions`);
    } catch (error) {
      this.logger.error('Session cleanup job failed', error);
      throw error;
    }
  }
}
```

### Repository Query

```typescript
// quiz/infrastructure/persistence/quiz-session.repository.ts
async findExpired(): Promise<QuizSession[]> {
  const now = new Date();

  const sessions = await this.prisma.quizSession.findMany({
    where: {
      status: 'IN_PROGRESS',
      expiresAt: { lt: now },
    },
    take: 100, // Batch size
  });

  return sessions.map(s => this.toDomain(s));
}
```

---

## 4. Leaderboard Weekly Reset Job

### Purpose
Reset `weeklyScore` to 0 for all players every Monday at midnight.

### Schedule
```typescript
@Cron('0 0 * * 1', { timeZone: 'UTC' })
// Every Monday at 00:00 UTC
```

### Implementation

```typescript
// cron/jobs/leaderboard-reset.job.ts
@Injectable()
export class LeaderboardResetJob {
  private readonly logger = new Logger(LeaderboardResetJob.name);

  constructor(
    private readonly rankingRepo: IPlayerRankingRepository,
    private readonly cache: RedisService,
    private readonly eventBus: EventBus,
  ) {}

  @Cron('0 0 * * 1', { timeZone: 'UTC' }) // Monday 00:00
  async resetWeeklyLeaderboard(): Promise<void> {
    this.logger.log('Starting weekly leaderboard reset');

    try {
      // Bulk update in database
      const resetCount = await this.rankingRepo.resetAllWeeklyScores();

      // Clear cache
      await this.cache.del('leaderboard:weekly:top100');
      await this.cache.del('leaderboard:weekly:*'); // All weekly cache

      this.eventBus.publish(new WeeklyLeaderboardResetEvent(new Date()));

      this.logger.log(`Weekly leaderboard reset completed. Reset ${resetCount} players.`);
    } catch (error) {
      this.logger.error('Weekly leaderboard reset failed', error);
      throw error;
    }
  }
}
```

### Repository Bulk Update

```typescript
// leaderboard/infrastructure/persistence/ranking.repository.ts
async resetAllWeeklyScores(): Promise<number> {
  const result = await this.prisma.playerRanking.updateMany({
    data: {
      weeklyScore: 0,
      weeklyRank: null,
    },
  });

  return result.count;
}
```

---

## 5. Leaderboard Rank Recalculation Job

### Purpose
Recalculate global and weekly ranks for all players.

### Schedule
```typescript
@Cron('*/10 * * * *') // Every 10 minutes
```

### Implementation

```typescript
// cron/jobs/leaderboard-recalc.job.ts
@Injectable()
export class LeaderboardRecalculationJob {
  private readonly logger = new Logger(LeaderboardRecalculationJob.name);

  constructor(
    private readonly rankingRepo: IPlayerRankingRepository,
    private readonly cache: RedisService,
  ) {}

  @Cron('*/10 * * * *')
  async recalculateRanks(): Promise<void> {
    this.logger.log('Starting leaderboard recalculation');

    try {
      // Recalculate global ranks
      await this.recalculateGlobalRanks();

      // Recalculate weekly ranks
      await this.recalculateWeeklyRanks();

      // Update cache
      await this.updateLeaderboardCache();

      this.logger.log('Leaderboard recalculation completed');
    } catch (error) {
      this.logger.error('Leaderboard recalculation failed', error);
      throw error;
    }
  }

  private async recalculateGlobalRanks(): Promise<void> {
    // Use window function for efficient ranking
    await this.prisma.$executeRaw`
      UPDATE player_rankings
      SET global_rank = ranked.rank
      FROM (
        SELECT
          id,
          ROW_NUMBER() OVER (ORDER BY global_score DESC) as rank
        FROM player_rankings
        WHERE global_score > 0
      ) ranked
      WHERE player_rankings.id = ranked.id
    `;
  }

  private async recalculateWeeklyRanks(): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE player_rankings
      SET weekly_rank = ranked.rank
      FROM (
        SELECT
          id,
          ROW_NUMBER() OVER (ORDER BY weekly_score DESC) as rank
        FROM player_rankings
        WHERE weekly_score > 0
      ) ranked
      WHERE player_rankings.id = ranked.id
    `;
  }

  private async updateLeaderboardCache(): Promise<void> {
    // Cache top 100 global
    const topGlobal = await this.rankingRepo.getTopGlobal(100);
    await this.cache.setex(
      'leaderboard:global:top100',
      300, // 5 minutes
      JSON.stringify(topGlobal),
    );

    // Cache top 100 weekly
    const topWeekly = await this.rankingRepo.getTopWeekly(100);
    await this.cache.setex(
      'leaderboard:weekly:top100',
      300,
      JSON.stringify(topWeekly),
    );
  }
}
```

---

## 6. Badge Evaluation (Event-Driven)

### Purpose
Check if player unlocked new badges after certain events.

### Trigger
Event-driven (not cron), triggered by:
- `QuizCompletedEvent`
- `LevelUpEvent`
- `StreakMilestoneEvent`

### Implementation

```typescript
// gamification/application/event-handlers/quiz-completed.handler.ts
@EventHandler(QuizCompletedEvent)
export class QuizCompletedBadgeHandler {
  constructor(
    private readonly badgeEvaluator: BadgeEvaluator,
    private readonly progressRepo: IPlayerProgressRepository,
    private readonly eventBus: EventBus,
  ) {}

  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    // Evaluate badges in background
    const newBadges = await this.badgeEvaluator.evaluateBadges(event.userId);

    if (newBadges.length > 0) {
      const progress = await this.progressRepo.findByUserId(event.userId);

      for (const badge of newBadges) {
        progress.unlockBadge(badge);

        this.eventBus.publish(
          new BadgeUnlockedEvent(event.userId, badge.id, badge.rarity),
        );
      }

      await this.progressRepo.save(progress);
    }
  }
}
```

### Badge Evaluator

```typescript
// gamification/domain/services/badge-evaluator.service.ts
@Injectable()
export class BadgeEvaluator {
  constructor(
    private readonly badgeRepo: IBadgeRepository,
    private readonly progressRepo: IPlayerProgressRepository,
  ) {}

  async evaluateBadges(userId: string): Promise<Badge[]> {
    const progress = await this.progressRepo.findByUserId(userId);
    const alreadyUnlocked = progress.unlockedBadges.map(pb => pb.badgeId);
    const allBadges = await this.badgeRepo.findAll();

    const newlyUnlocked: Badge[] = [];

    for (const badge of allBadges) {
      if (alreadyUnlocked.includes(badge.id)) continue;

      if (await this.meetsCondition(badge, progress)) {
        newlyUnlocked.push(badge);
      }
    }

    return newlyUnlocked;
  }

  private async meetsCondition(badge: Badge, progress: PlayerProgress): Promise<boolean> {
    const condition = badge.conditionData as BadgeCondition;

    // See business-rules-implementation.md for full implementation
    switch (condition.type) {
      case 'quizzes_completed':
        return progress.totalQuizzes >= condition.count;
      case 'perfect_quizzes':
        return progress.perfectQuizzes >= condition.count;
      case 'streak':
        return progress.currentStreak >= condition.days;
      // ... etc
    }
  }
}
```

---

## Monitoring and Alerting

### Health Checks

```typescript
// cron/health/cron-health.controller.ts
@Controller('health/cron')
export class CronHealthController {
  constructor(private readonly cronJobRepo: ICronJobRepository) {}

  @Get()
  async checkCronHealth(): Promise<CronHealthResponse> {
    const jobs = await this.cronJobRepo.findAll();

    const unhealthyJobs = jobs.filter(job => {
      const timeSinceLastRun = Date.now() - job.lastRunAt.getTime();
      const expectedInterval = this.getExpectedInterval(job.name);

      return timeSinceLastRun > expectedInterval * 2; // 2x expected
    });

    return {
      healthy: unhealthyJobs.length === 0,
      jobs: jobs.map(job => ({
        name: job.name,
        lastRun: job.lastRunAt,
        nextRun: job.nextRunAt,
        status: job.status,
      })),
      unhealthyJobs: unhealthyJobs.map(j => j.name),
    };
  }

  private getExpectedInterval(jobName: string): number {
    const intervals: Record<string, number> = {
      'life-regeneration': 5 * 60 * 1000, // 5 minutes
      'session-cleanup': 5 * 60 * 1000,
      'leaderboard-recalc': 10 * 60 * 1000,
      'streak-update': 24 * 60 * 60 * 1000, // 1 day
      'leaderboard-reset': 7 * 24 * 60 * 60 * 1000, // 1 week
    };

    return intervals[jobName] || 60 * 60 * 1000; // Default 1 hour
  }
}
```

### Job Tracking

```typescript
// shared/infrastructure/decorators/track-job.decorator.ts
export function TrackJob() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const jobName = target.constructor.name;
      const cronJobRepo = this.cronJobRepo as ICronJobRepository;

      try {
        // Update job start
        await cronJobRepo.updateStatus(jobName, 'running');

        // Execute job
        const result = await originalMethod.apply(this, args);

        // Update job success
        await cronJobRepo.updateStatus(jobName, 'completed', new Date());

        return result;
      } catch (error) {
        // Update job failure
        await cronJobRepo.updateStatus(jobName, 'failed');
        throw error;
      }
    };

    return descriptor;
  };
}

// Usage
@Injectable()
export class LifeRegenerationJob {
  @Cron(CronExpression.EVERY_5_MINUTES)
  @TrackJob()
  async regenerateLives(): Promise<void> {
    // Job logic
  }
}
```

---

## Testing Cron Jobs

### Unit Test (Mock Time)

```typescript
describe('StreakUpdateJob', () => {
  let job: StreakUpdateJob;
  let mockProgressRepo: jest.Mocked<IPlayerProgressRepository>;

  beforeEach(() => {
    // Setup mocks
  });

  it('should reset streak for players who missed yesterday', async () => {
    // Arrange
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const progress = PlayerProgressTestFactory.create({
      lastPlayedAt: twoDaysAgo,
      currentStreak: 10,
    });

    mockProgressRepo.findAll.mockResolvedValue([progress]);

    // Act
    await job.updateStreaks();

    // Assert
    expect(progress.currentStreak).toBe(0);
    expect(mockProgressRepo.save).toHaveBeenCalled();
  });
});
```

### Integration Test (Manual Trigger)

```typescript
describe('LifeRegenerationJob (Integration)', () => {
  let app: INestApplication;
  let job: LifeRegenerationJob;

  beforeEach(async () => {
    // Setup test app
  });

  it('should regenerate lives after 30 minutes', async () => {
    // Arrange: Create player with 3/5 lives, lastRegen 35 min ago
    const userId = 'test-user';
    await createPlayerWithLives(userId, 3, 35);

    // Act
    await job.regenerateLives();

    // Assert
    const lives = await prisma.lives.findUnique({ where: { userId } });
    expect(lives.currentLives).toBe(4); // 3 + 1 regen
  });
});
```

---

## Performance Considerations

### Batch Processing
- Process jobs in batches of 100-1000 records
- Use cursor-based pagination for large datasets
- Avoid loading all records into memory

### Database Optimization
- Add indexes on frequently queried columns (`expiresAt`, `lastRegenAt`)
- Use `LIMIT` in queries
- Consider partitioning for very large tables

### Error Handling
- Continue processing batch even if single record fails
- Log errors with context (userId, recordId)
- Alert on high failure rate (>10%)

---

## Summary

### Cron Schedule Overview
```
Every 5 minutes:
  - Life Regeneration
  - Session Cleanup

Every 10 minutes:
  - Leaderboard Recalculation

Daily at 00:00 UTC:
  - Streak Update

Weekly on Monday 00:00 UTC:
  - Leaderboard Weekly Reset
```

### Critical Jobs (Must Not Fail)
1. Life Regeneration - affects player ability to play
2. Streak Update - affects player retention

### Non-Critical Jobs (Can Retry)
1. Leaderboard Recalculation - eventual consistency acceptable
2. Session Cleanup - cosmetic cleanup

### Monitoring Checklist
- ✅ Track last run time for each job
- ✅ Alert if job hasn't run in 2x expected interval
- ✅ Log execution duration
- ✅ Alert on errors/failures
- ✅ Health check endpoint for cron jobs

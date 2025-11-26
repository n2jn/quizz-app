# Jobs Agent - Background Jobs

You are the Jobs Agent responsible for implementing background jobs (tickets #054-#059).

## Your Mission

Implement scheduled background jobs using cron:
- Life regeneration job (every 30 minutes)
- Streak update job (daily at midnight)
- Session cleanup job (hourly)
- Leaderboard reset jobs (weekly, monthly)
- Leaderboard recalculation job (hourly)
- Job health monitoring

## Primary References

**Read these first:**
- `docs/architecture/03-Technical-Architecture/background-jobs.md` - Job specifications
- `docs/architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md` - Constants and timing
- `docs/architecture/03-Technical-Architecture/business-rules-implementation.md` - Business logic

## Your Tickets (Phase 4 - Jobs)

1. **#054** - Life Regeneration Job
2. **#055** - Streak Update Job
3. **#056** - Session Cleanup Job
4. **#057** - Leaderboard Reset Job
5. **#058** - Leaderboard Recalculation Job
6. **#059** - Job Health Monitoring

## Technology Stack

**NestJS Schedule Module:**
```typescript
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class LifeRegenerationJob {
  @Cron(CronExpression.EVERY_30_MINUTES)
  async regenerateLives() {
    // Job logic
  }
}
```

## Job Specifications

### #054 - Life Regeneration Job

**Schedule:** Every 30 minutes
**Cron:** `*/30 * * * *` or `CronExpression.EVERY_30_MINUTES`

**Logic:**
```typescript
@Injectable()
export class LifeRegenerationJob {
  @Cron(CronExpression.EVERY_30_MINUTES)
  async regenerateLives() {
    // 1. Find all Lives where:
    //    - currentLives < MAX_LIVES (5)
    //    - nextRegenAt <= now

    const eligibleLives = await this.livesRepo.findEligibleForRegen()

    for (const lives of eligibleLives) {
      // 2. Add 1 life
      lives.currentLives++

      // 3. Update regen timestamps
      lives.lastRegenAt = new Date()
      lives.nextRegenAt = addMinutes(new Date(), LIFE_REGEN_MINUTES)

      // 4. Save
      await this.livesRepo.save(lives)
    }

    this.logger.log(`Regenerated lives for ${eligibleLives.length} users`)
  }
}
```

**Business Rules:**
- Only regenerate if `currentLives < MAX_LIVES`
- Only regenerate if `now >= nextRegenAt`
- Increment by 1 life per execution
- Update `lastRegenAt` and `nextRegenAt`

---

### #055 - Streak Update Job

**Schedule:** Daily at midnight UTC
**Cron:** `0 0 * * *` or `CronExpression.EVERY_DAY_AT_MIDNIGHT`

**Logic:**
```typescript
@Injectable()
export class StreakUpdateJob {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateStreaks() {
    // 1. Find all PlayerProgress where:
    //    - lastQuizDate is NOT today
    //    - currentStreak > 0

    const now = new Date()
    const allProgress = await this.progressRepo.findAllWithActiveStreaks()

    for (const progress of allProgress) {
      const hoursSinceLastQuiz =
        (now - progress.lastQuizDate) / (1000 * 60 * 60)

      // 2. Check if streak should break (>48 hours)
      if (hoursSinceLastQuiz > 48) {
        if (progress.streak.protectionsRemaining > 0) {
          // Use protection, keep streak
          progress.streak.useProtection()
          this.logger.log(`Protected streak for user ${progress.userId}`)
        } else {
          // Break streak
          progress.streak.break()
          this.eventBus.publish(
            new StreakBrokenEvent(progress.userId, progress.streak.currentStreak)
          )
          this.logger.log(`Broke streak for user ${progress.userId}`)
        }

        await this.progressRepo.save(progress)
      }
    }
  }
}
```

**Business Rules:**
- Check all users daily
- Break streak if >48 hours since last quiz
- Use protection if available (max 2)
- Emit `StreakBrokenEvent` when streak breaks

---

### #056 - Session Cleanup Job

**Schedule:** Every hour
**Cron:** `0 * * * *` or `CronExpression.EVERY_HOUR`

**Logic:**
```typescript
@Injectable()
export class SessionCleanupJob {
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupSessions() {
    // 1. Find all QuizSessions where:
    //    - status = 'active'
    //    - expiresAt <= now

    const now = new Date()
    const expiredSessions = await this.sessionRepo.findExpiredSessions(now)

    for (const session of expiredSessions) {
      // 2. Mark as expired
      session.status = SessionStatus.EXPIRED
      session.completedAt = now

      // 3. Emit event (life was consumed but quiz not completed)
      this.eventBus.publish(new QuizAbandonedEvent(session.userId, session.id))

      await this.sessionRepo.save(session)
    }

    this.logger.log(`Cleaned up ${expiredSessions.length} expired sessions`)
  }
}
```

**Business Rules:**
- Sessions expire after 10 minutes (SESSION_TIMEOUT_MINUTES)
- Mark expired sessions as `status: 'expired'`
- Emit `QuizAbandonedEvent` (life was consumed)
- Run hourly to avoid buildup

---

### #057 - Leaderboard Reset Job

**Schedule:**
- Weekly: Monday at midnight UTC (`0 0 * * 1`)
- Monthly: 1st of month at midnight UTC (`0 0 1 * *`)

**Logic:**
```typescript
@Injectable()
export class LeaderboardResetJob {
  @Cron('0 0 * * 1') // Weekly
  async resetWeeklyLeaderboard() {
    await this.resetLeaderboard(LeaderboardType.WEEKLY)
  }

  @Cron('0 0 1 * *') // Monthly
  async resetMonthlyLeaderboard() {
    await this.resetLeaderboard(LeaderboardType.MONTHLY)
  }

  private async resetLeaderboard(type: LeaderboardType) {
    // 1. Archive current rankings (for historical records)
    await this.rankingRepo.archiveLeaderboard(type)

    // 2. Clear Redis cache
    await this.cacheService.resetLeaderboard(type)

    // 3. Reset all rankings to 0 (but keep users in table)
    await this.rankingRepo.resetScores(type)

    // 4. Emit event
    this.eventBus.publish(new LeaderboardResetEvent(type, new Date()))

    this.logger.log(`Reset ${type} leaderboard`)
  }
}
```

**Business Rules:**
- Weekly leaderboard resets every Monday at 00:00 UTC
- Monthly leaderboard resets on 1st of month at 00:00 UTC
- Archive old data before reset (for historical analysis)
- Clear Redis cache to force rebuild

---

### #058 - Leaderboard Recalculation Job

**Schedule:** Every hour
**Cron:** `0 * * * *` or `CronExpression.EVERY_HOUR`

**Logic:**
```typescript
@Injectable()
export class LeaderboardRecalculationJob {
  @Cron(CronExpression.EVERY_HOUR)
  async recalculateLeaderboards() {
    // 1. Fetch all players with updated XP since last run
    const players = await this.progressRepo.findAll()

    // 2. Rebuild global leaderboard
    await this.rebuildLeaderboard(players, LeaderboardType.GLOBAL)

    // 3. Rebuild weekly leaderboard
    await this.rebuildLeaderboard(players, LeaderboardType.WEEKLY)

    // 4. Rebuild monthly leaderboard
    await this.rebuildLeaderboard(players, LeaderboardType.MONTHLY)

    this.logger.log('Recalculated all leaderboards')
  }

  private async rebuildLeaderboard(
    players: PlayerProgress[],
    type: LeaderboardType
  ) {
    // Sort by XP descending, then by latest XP timestamp
    const sorted = players
      .sort((a, b) => {
        if (a.xp !== b.xp) return b.xp - a.xp
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      })

    // Update Redis cache
    await this.cacheService.clearLeaderboard(type)
    for (const player of sorted) {
      await this.cacheService.updatePlayerScore(
        player.userId,
        player.username,
        player.xp,
        type
      )
    }

    // Update PostgreSQL
    await this.rankingRepo.bulkUpdate(sorted, type)
  }
}
```

**Business Rules:**
- Recalculate hourly to sync Redis with PostgreSQL
- Handles tie-breaking (latest XP timestamp wins)
- Updates both cache and database

---

### #059 - Job Health Monitoring

**Schedule:** Every 5 minutes
**Cron:** `*/5 * * * *`

**Logic:**
```typescript
@Injectable()
export class JobHealthMonitoringService {
  private lastExecutions = new Map<string, Date>()

  @Cron('*/5 * * * *')
  async checkJobHealth() {
    const checks = [
      { name: 'LifeRegen', maxAge: 35 * 60 * 1000 },     // 35 min
      { name: 'StreakUpdate', maxAge: 25 * 60 * 60 * 1000 }, // 25 hours
      { name: 'SessionCleanup', maxAge: 65 * 60 * 1000 },    // 65 min
      { name: 'LeaderboardRecalc', maxAge: 65 * 60 * 1000 }, // 65 min
    ]

    for (const check of checks) {
      const lastExec = this.lastExecutions.get(check.name)
      if (!lastExec) continue

      const age = Date.now() - lastExec.getTime()
      if (age > check.maxAge) {
        this.logger.error(`Job ${check.name} is unhealthy (last run: ${age}ms ago)`)
        // Send alert (email, Slack, etc.)
        await this.alertService.send(`Job ${check.name} failed to run`)
      }
    }
  }

  recordExecution(jobName: string) {
    this.lastExecutions.set(jobName, new Date())
  }
}
```

**Monitoring:**
- Track last execution timestamp for each job
- Alert if job hasn't run within expected window
- Integrate with logging/monitoring service (e.g., Sentry, DataDog)

---

## Quality Standards

- **Error Handling:** Jobs must not crash on individual failures
- **Logging:** Log start, end, and results of each job
- **Idempotency:** Jobs must be safe to run multiple times
- **Performance:** Use batching for large datasets
- **Monitoring:** Track execution times and failures

## Dependencies

**Requires:**
- Phase 1 complete (shared infrastructure)
- Economy context complete (Lives aggregate)
- Gamification context complete (Streak logic)
- Quiz context complete (QuizSession)
- Leaderboard context complete (rankings)

## Workflow

1. **#054** - Life regeneration (30 min intervals)
2. **#055** - Streak updates (daily midnight)
3. **#056** - Session cleanup (hourly)
4. **#057** - Leaderboard resets (weekly/monthly)
5. **#058** - Leaderboard recalculation (hourly)
6. **#059** - Health monitoring (5 min intervals)

## Testing Checklist

- [ ] Life regeneration logic
- [ ] Streak break with/without protection
- [ ] Session expiration detection
- [ ] Weekly leaderboard reset (Monday 00:00)
- [ ] Monthly leaderboard reset (1st 00:00)
- [ ] Leaderboard recalculation accuracy
- [ ] Job health monitoring alerts
- [ ] Error handling (partial failures)
- [ ] Logging and observability
- [ ] Performance (large datasets)

## Cron Schedule Reference

```typescript
*/30 * * * *    // Every 30 minutes
0 * * * *       // Every hour
0 0 * * *       // Every day at midnight
0 0 * * 1       // Every Monday at midnight
0 0 1 * *       // 1st of month at midnight
*/5 * * * *     // Every 5 minutes
```

**Ready to implement?** Ask the user which ticket to start with, or begin with #054.

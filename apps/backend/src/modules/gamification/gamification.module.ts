import { Module } from '@nestjs/common';

/**
 * Gamification Bounded Context
 *
 * Responsibilities:
 * - Player progress tracking (XP, levels)
 * - Badge system
 * - Streak management
 * - Category statistics
 * - Achievement evaluation
 *
 * Domain Events Emitted:
 * - ExperienceGainedEvent
 * - LevelUpEvent
 * - BadgeUnlockedEvent
 * - StreakIncrementedEvent
 * - StreakLostEvent
 * - StreakMilestoneEvent
 *
 * Domain Events Consumed:
 * - QuizCompletedEvent -> Add XP, update streak, check badges
 * - PerfectScoreAchievedEvent -> Check for perfect score badges
 */
@Module({
  imports: [],
  providers: [],
  controllers: [],
  exports: [],
})
export class GamificationModule {}

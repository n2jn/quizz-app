import { Module } from '@nestjs/common';

/**
 * Leaderboard Bounded Context
 *
 * Responsibilities:
 * - Global leaderboard rankings
 * - Weekly leaderboard rankings
 * - Rank calculation and caching
 * - Nearby player rankings
 *
 * Domain Events Emitted:
 * - RankingUpdatedEvent
 *
 * Domain Events Consumed:
 * - QuizCompletedEvent -> Update player score and ranking
 */
@Module({
  imports: [],
  providers: [],
  controllers: [],
  exports: [],
})
export class LeaderboardModule {}

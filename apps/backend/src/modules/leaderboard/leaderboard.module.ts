import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from '@shared/shared.module';

// Controllers
import { LeaderboardController } from './presentation/controllers/leaderboard.controller';

// Query Handlers
import { GetLeaderboardHandler } from './application/queries/get-leaderboard.handler';

// Repositories
import { PlayerRankingRepository } from './infrastructure/repositories/player-ranking.repository';

// Event Handlers
import { UserRegisteredLeaderboardHandler } from './application/event-handlers/user-registered.handler';
import { QuizSessionCompletedLeaderboardHandler } from './application/event-handlers/quiz-session-completed.handler';

const QueryHandlers = [GetLeaderboardHandler];
const EventHandlers = [
  UserRegisteredLeaderboardHandler,
  QuizSessionCompletedLeaderboardHandler,
];

const Repositories = [
  {
    provide: 'IPlayerRankingRepository',
    useClass: PlayerRankingRepository,
  },
];

/**
 * Leaderboard Bounded Context
 *
 * Responsibilities:
 * - Global leaderboard rankings
 * - Weekly leaderboard rankings
 * - Rank calculation
 *
 * Domain Events Consumed:
 * - QuizSessionCompletedEvent -> Update player score and ranking
 */
@Module({
  imports: [CqrsModule, SharedModule],
  controllers: [LeaderboardController],
  providers: [...QueryHandlers, ...EventHandlers, ...Repositories],
  exports: [],
})
export class LeaderboardModule {}

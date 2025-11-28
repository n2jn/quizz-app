import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from '@shared/shared.module';

// Controllers
import { GamificationController } from './presentation/controllers/gamification.controller';

// Query Handlers
import { GetProgressHandler } from './application/queries/get-progress.handler';

// Repositories
import { PlayerProgressRepository } from './infrastructure/repositories/player-progress.repository';

// Event Handlers
import { UserRegisteredGamificationHandler } from './application/event-handlers/user-registered.handler';
import { QuizSessionCompletedGamificationHandler } from './application/event-handlers/quiz-session-completed.handler';

const QueryHandlers = [GetProgressHandler];
const EventHandlers = [
  UserRegisteredGamificationHandler,
  QuizSessionCompletedGamificationHandler,
];

const Repositories = [
  {
    provide: 'IPlayerProgressRepository',
    useClass: PlayerProgressRepository,
  },
];

/**
 * Gamification Bounded Context
 *
 * Responsibilities:
 * - Player progress tracking (XP, levels)
 * - Streak management
 * - Statistics tracking
 *
 * Domain Events Emitted:
 * - LevelUpEvent
 * - StreakUpdatedEvent
 *
 * Domain Events Consumed:
 * - QuizSessionCompletedEvent -> Add XP, update stats, update streak
 */
@Module({
  imports: [CqrsModule, SharedModule],
  controllers: [GamificationController],
  providers: [...QueryHandlers, ...EventHandlers, ...Repositories],
  exports: [],
})
export class GamificationModule {}

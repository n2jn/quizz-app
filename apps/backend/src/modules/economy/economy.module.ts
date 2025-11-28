import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from '@shared/shared.module';

// Controllers
import { EconomyController } from './presentation/controllers/economy.controller';

// Command Handlers
import { PurchaseItemHandler } from './application/commands/purchase-item.handler';

// Query Handlers
import { GetWalletHandler } from './application/queries/get-wallet.handler';
import { GetLivesHandler } from './application/queries/get-lives.handler';

// Repositories
import { WalletRepository } from './infrastructure/repositories/wallet.repository';
import { LivesRepository } from './infrastructure/repositories/lives.repository';

// Event Handlers
import { UserRegisteredEconomyHandler } from './application/event-handlers/user-registered.handler';
import { QuizSessionCompletedEconomyHandler } from './application/event-handlers/quiz-session-completed.handler';
import { QuizSessionStartedEconomyHandler } from './application/event-handlers/quiz-session-started.handler';
import { LevelUpEconomyHandler } from './application/event-handlers/level-up.handler';

const CommandHandlers = [PurchaseItemHandler];
const QueryHandlers = [GetWalletHandler, GetLivesHandler];
const EventHandlers = [
  UserRegisteredEconomyHandler,
  QuizSessionCompletedEconomyHandler,
  QuizSessionStartedEconomyHandler,
  LevelUpEconomyHandler,
];

const Repositories = [
  {
    provide: 'IWalletRepository',
    useClass: WalletRepository,
  },
  {
    provide: 'ILivesRepository',
    useClass: LivesRepository,
  },
];

/**
 * Economy Bounded Context
 *
 * Responsibilities:
 * - Wallet management (coins)
 * - Transaction history
 * - Lives system (current, regeneration)
 * - Shop item purchases
 * - Coin rewards and spending
 *
 * Domain Events Emitted:
 * - CoinsEarnedEvent
 * - CoinsSpentEvent
 * - LifeConsumedEvent
 * - LifeRestoredEvent
 *
 * Domain Events Consumed:
 * - UserRegisteredEvent -> Create wallet and lives
 * - QuizSessionStartedEvent -> Consume 1 life
 * - QuizSessionCompletedEvent -> Award coins based on score
 */
@Module({
  imports: [CqrsModule, SharedModule],
  controllers: [EconomyController],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers, ...Repositories],
  exports: [],
})
export class EconomyModule {}

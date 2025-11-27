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

const CommandHandlers = [PurchaseItemHandler];
const QueryHandlers = [GetWalletHandler, GetLivesHandler];

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
  providers: [...CommandHandlers, ...QueryHandlers, ...Repositories],
  exports: [],
})
export class EconomyModule {}

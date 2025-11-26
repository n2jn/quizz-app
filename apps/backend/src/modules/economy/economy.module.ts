import { Module } from '@nestjs/common';

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
 * - LifeRegeneratedEvent
 *
 * Domain Events Consumed:
 * - UserRegisteredEvent -> Create wallet and lives
 * - QuizStartedEvent -> Consume 1 life
 * - QuizCompletedEvent -> Award 10 coins
 * - PerfectScoreAchievedEvent -> Award 50 coins
 * - LevelUpEvent -> Award 100 coins
 * - BadgeUnlockedEvent -> Award badge reward coins
 * - StreakMilestoneEvent -> Award streak milestone coins
 */
@Module({
  imports: [],
  providers: [],
  controllers: [],
  exports: [],
})
export class EconomyModule {}

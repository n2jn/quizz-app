import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';

/**
 * Level Up Event Handler (Economy Context)
 *
 * Awards bonus coins when player levels up.
 */
export class LevelUpEconomyHandler {
  private readonly logger = new Logger(LevelUpEconomyHandler.name);
  private static readonly LEVEL_UP_BONUS = 100;

  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
    private readonly eventBus: EventBusService,
  ) {}

  @OnEvent('player.level_up')
  async handle(event: any) {
    const { userId, newLevel } = event.props;

    this.logger.log(`Awarding level up bonus for user: ${userId} (Level ${newLevel})`);

    try {
      const wallet = await this.walletRepository.getOrCreate(userId);

      wallet.addCoins(
        LevelUpEconomyHandler.LEVEL_UP_BONUS,
        'level_up_bonus',
        `Reached Level ${newLevel}!`,
      );

      await this.walletRepository.save(wallet);

      // Publish wallet events
      await this.eventBus.publishAll([...wallet.domainEvents]);
      wallet.clearEvents();

      this.logger.log(
        `Awarded ${LevelUpEconomyHandler.LEVEL_UP_BONUS} coins to user: ${userId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to award level up bonus for user: ${userId}`, error);
      throw error;
    }
  }
}

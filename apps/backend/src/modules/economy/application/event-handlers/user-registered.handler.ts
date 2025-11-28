import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';

/**
 * User Registered Event Handler (Economy Context)
 *
 * When a new user registers, initialize their economy:
 * - Create wallet with 0 balance
 * - Create lives with 5/5 lives
 */
export class UserRegisteredEconomyHandler {
  private readonly logger = new Logger(UserRegisteredEconomyHandler.name);

  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
    @Inject('ILivesRepository')
    private readonly livesRepository: ILivesRepository,
  ) {}

  @OnEvent('user.registered')
  async handle(event: any) {
    this.logger.log(`Creating economy for user: ${event.props.userId}`);

    try {
      // Wallet and lives are auto-created via getOrCreate pattern
      // This ensures they exist when user first accesses them
      await this.walletRepository.getOrCreate(event.props.userId);
      await this.livesRepository.getOrCreate(event.props.userId);

      this.logger.log(`Economy initialized for user: ${event.props.userId}`);
    } catch (error) {
      this.logger.error(`Failed to initialize economy for user: ${event.props.userId}`, error);
      throw error;
    }
  }
}

import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IPlayerProgressRepository } from '../../domain/repositories/player-progress.repository.interface';

/**
 * User Registered Event Handler (Gamification Context)
 *
 * Initializes player progress when a new user registers.
 */
export class UserRegisteredGamificationHandler {
  private readonly logger = new Logger(UserRegisteredGamificationHandler.name);

  constructor(
    @Inject('IPlayerProgressRepository')
    private readonly progressRepository: IPlayerProgressRepository,
  ) {}

  @OnEvent('user.registered')
  async handle(event: any) {
    this.logger.log(`Creating player progress for user: ${event.props.userId}`);

    try {
      // Player progress auto-created via getOrCreate pattern
      await this.progressRepository.getOrCreate(event.props.userId);

      this.logger.log(`Player progress initialized for user: ${event.props.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to initialize player progress for user: ${event.props.userId}`,
        error,
      );
      throw error;
    }
  }
}

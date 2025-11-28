import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IPlayerRankingRepository } from '../../domain/repositories/player-ranking.repository.interface';

/**
 * User Registered Event Handler (Leaderboard Context)
 *
 * Initializes player ranking when a new user registers.
 */
export class UserRegisteredLeaderboardHandler {
  private readonly logger = new Logger(UserRegisteredLeaderboardHandler.name);

  constructor(
    @Inject('IPlayerRankingRepository')
    private readonly rankingRepository: IPlayerRankingRepository,
  ) {}

  @OnEvent('user.registered')
  async handle(event: any) {
    this.logger.log(`Creating player ranking for user: ${event.props.userId}`);

    try {
      // Player ranking auto-created via getOrCreate pattern
      await this.rankingRepository.getOrCreate(event.props.userId);

      this.logger.log(`Player ranking initialized for user: ${event.props.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to initialize player ranking for user: ${event.props.userId}`,
        error,
      );
      throw error;
    }
  }
}

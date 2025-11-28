import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IPlayerRankingRepository } from '../../domain/repositories/player-ranking.repository.interface';

/**
 * Quiz Session Completed Event Handler (Leaderboard Context)
 *
 * Updates player ranking scores based on quiz score.
 */
export class QuizSessionCompletedLeaderboardHandler {
  private readonly logger = new Logger(QuizSessionCompletedLeaderboardHandler.name);

  constructor(
    @Inject('IPlayerRankingRepository')
    private readonly rankingRepository: IPlayerRankingRepository,
  ) {}

  @OnEvent('quiz.session.completed')
  async handle(event: any) {
    const { userId, totalPoints } = event.props;

    this.logger.log(`Updating leaderboard score for user: ${userId} (+${totalPoints} points)`);

    try {
      const ranking = await this.rankingRepository.getOrCreate(userId);

      // Add score to both global and weekly leaderboards
      ranking.addScore(totalPoints);

      await this.rankingRepository.save(ranking);

      this.logger.log(
        `Leaderboard updated for user ${userId}: Global ${ranking.globalScore}, Weekly ${ranking.weeklyScore}`,
      );
    } catch (error) {
      this.logger.error(`Failed to update leaderboard for user: ${userId}`, error);
      throw error;
    }
  }
}

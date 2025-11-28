import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IPlayerProgressRepository } from '../../domain/repositories/player-progress.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';

/**
 * Quiz Session Completed Event Handler (Gamification Context)
 *
 * Updates player progress:
 * - Award XP based on correct answers (50 XP per correct answer)
 * - Record quiz completion stats
 * - Increment daily streak
 */
export class QuizSessionCompletedGamificationHandler {
  private readonly logger = new Logger(QuizSessionCompletedGamificationHandler.name);
  private static readonly XP_PER_CORRECT = 50;

  constructor(
    @Inject('IPlayerProgressRepository')
    private readonly progressRepository: IPlayerProgressRepository,
    private readonly eventBus: EventBusService,
  ) {}

  @OnEvent('quiz.session.completed')
  async handle(event: any) {
    const { userId, correctAnswers, totalQuestions } = event.props;

    this.logger.log(
      `Updating progress for quiz: ${correctAnswers}/${totalQuestions} (user: ${userId})`,
    );

    try {
      const progress = await this.progressRepository.getOrCreate(userId);

      // Award XP
      const xpEarned =
        correctAnswers * QuizSessionCompletedGamificationHandler.XP_PER_CORRECT;
      progress.addXP(xpEarned);

      // Record quiz stats
      progress.recordQuizCompletion(correctAnswers, totalQuestions);

      // Increment streak (simplified - in production, check if daily quiz)
      progress.incrementStreak();

      await this.progressRepository.save(progress);

      // Publish progress events (level up, streak updated)
      await this.eventBus.publishAll([...progress.domainEvents]);
      progress.clearEvents();

      this.logger.log(
        `Progress updated for user ${userId}: +${xpEarned} XP, Level ${progress.currentLevel}, Streak ${progress.currentStreak}`,
      );
    } catch (error) {
      this.logger.error(`Failed to update progress for user: ${userId}`, error);
      throw error;
    }
  }
}

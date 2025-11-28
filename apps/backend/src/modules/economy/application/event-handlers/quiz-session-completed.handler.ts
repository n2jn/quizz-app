import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';

/**
 * Quiz Session Completed Event Handler (Economy Context)
 *
 * Awards coins based on quiz performance:
 * - Base: 10 coins per correct answer
 * - Perfect score bonus: 50 coins
 */
export class QuizSessionCompletedEconomyHandler {
  private readonly logger = new Logger(QuizSessionCompletedEconomyHandler.name);
  private static readonly COINS_PER_CORRECT = 10;
  private static readonly PERFECT_SCORE_BONUS = 50;

  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
    private readonly eventBus: EventBusService,
  ) {}

  @OnEvent('quiz.session.completed')
  async handle(event: any) {
    const { userId, correctAnswers, totalQuestions } = event.props;

    this.logger.log(
      `Awarding coins for quiz: ${correctAnswers}/${totalQuestions} correct (user: ${userId})`,
    );

    try {
      const wallet = await this.walletRepository.getOrCreate(userId);

      // Award coins for correct answers
      const baseCoins = correctAnswers * QuizSessionCompletedEconomyHandler.COINS_PER_CORRECT;
      wallet.addCoins(baseCoins, 'quiz_reward', `Answered ${correctAnswers} questions correctly`);

      // Perfect score bonus
      if (event.props.isPerfectScore) {
        wallet.addCoins(
          QuizSessionCompletedEconomyHandler.PERFECT_SCORE_BONUS,
          'perfect_score_bonus',
          'Perfect quiz score!',
        );
      }

      await this.walletRepository.save(wallet);

      // Publish wallet events
      await this.eventBus.publishAll([...wallet.domainEvents]);
      wallet.clearEvents();

      const totalCoins =
        baseCoins + (event.props.isPerfectScore ? QuizSessionCompletedEconomyHandler.PERFECT_SCORE_BONUS : 0);
      this.logger.log(`Awarded ${totalCoins} coins to user: ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to award coins for user: ${userId}`, error);
      throw error;
    }
  }
}

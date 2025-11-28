import { Inject, Logger, BadRequestException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';

/**
 * Quiz Session Started Event Handler (Economy Context)
 *
 * Consumes 1 life when a quiz session starts.
 * If no lives available, the quiz start should be prevented at the application layer.
 */
export class QuizSessionStartedEconomyHandler {
  private readonly logger = new Logger(QuizSessionStartedEconomyHandler.name);

  constructor(
    @Inject('ILivesRepository')
    private readonly livesRepository: ILivesRepository,
    private readonly eventBus: EventBusService,
  ) {}

  @OnEvent('quiz.session.started')
  async handle(event: any) {
    const { userId, sessionId } = event.props;

    this.logger.log(`Consuming life for quiz session: ${sessionId} (user: ${userId})`);

    try {
      const lives = await this.livesRepository.getOrCreate(userId);

      // Trigger regeneration check before consuming
      lives.regenerateLives();

      if (!lives.hasLives()) {
        this.logger.warn(`User ${userId} has no lives available`);
        // Note: This should ideally be checked before quiz starts
        throw new BadRequestException('No lives available');
      }

      lives.consumeLife();
      await this.livesRepository.save(lives);

      // Publish life events
      await this.eventBus.publishAll([...lives.domainEvents]);
      lives.clearEvents();

      this.logger.log(
        `Life consumed for user: ${userId}. Lives remaining: ${lives.currentLives}`,
      );
    } catch (error) {
      this.logger.error(`Failed to consume life for user: ${userId}`, error);
      throw error;
    }
  }
}

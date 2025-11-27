import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CompleteQuizSessionCommand } from './complete-quiz-session.command';
import { IQuizSessionRepository } from '../../domain/repositories/quiz-session.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';

export interface CompleteQuizSessionResult {
  sessionId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
}

/**
 * Complete Quiz Session Command Handler
 *
 * Handles quiz session completion:
 * 1. Validate session exists and is in progress
 * 2. Complete session (triggers business logic)
 * 3. Persist updated session
 * 4. Publish QuizSessionCompletedEvent
 * 5. Return summary
 */
@Injectable()
@CommandHandler(CompleteQuizSessionCommand)
export class CompleteQuizSessionHandler
  implements ICommandHandler<CompleteQuizSessionCommand, CompleteQuizSessionResult>
{
  constructor(
    @Inject('IQuizSessionRepository')
    private readonly sessionRepository: IQuizSessionRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: CompleteQuizSessionCommand): Promise<CompleteQuizSessionResult> {
    // Get session
    const session = await this.sessionRepository.findById(command.sessionId);
    if (!session) {
      throw new NotFoundException('Quiz session not found');
    }

    // Complete session (triggers domain event)
    session.complete();

    // Save updated session
    await this.sessionRepository.save(session);

    // Publish domain events
    await this.eventBus.publishAll([...session.domainEvents]);
    session.clearEvents();

    // Calculate results
    const correctAnswers = session.answers.filter((a) => a.isCorrect).length;

    return {
      sessionId: session.id,
      userId: session.userId,
      score: session.score,
      totalQuestions: session.answers.length,
      correctAnswers,
      completedAt: session.completedAt!,
    };
  }
}

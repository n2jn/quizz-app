import { ICommandHandler } from '@nestjs/cqrs';
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
export declare class CompleteQuizSessionHandler implements ICommandHandler<CompleteQuizSessionCommand, CompleteQuizSessionResult> {
    private readonly sessionRepository;
    private readonly eventBus;
    constructor(sessionRepository: IQuizSessionRepository, eventBus: EventBusService);
    execute(command: CompleteQuizSessionCommand): Promise<CompleteQuizSessionResult>;
}

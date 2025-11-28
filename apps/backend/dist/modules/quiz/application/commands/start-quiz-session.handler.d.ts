import { ICommandHandler } from '@nestjs/cqrs';
import { StartQuizSessionCommand } from './start-quiz-session.command';
import { IQuizSessionRepository } from '../../domain/repositories/quiz-session.repository.interface';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
export interface StartQuizSessionResult {
    sessionId: string;
    userId: string;
    difficultyId: string;
    categoryId: string | null;
    questions: QuestionData[];
    expiresAt: Date;
}
export interface QuestionData {
    id: string;
    text: string;
    imageUrl: string | null;
    answers: AnswerData[];
}
export interface AnswerData {
    id: string;
    text: string;
}
export declare class StartQuizSessionHandler implements ICommandHandler<StartQuizSessionCommand, StartQuizSessionResult> {
    private readonly sessionRepository;
    private readonly questionRepository;
    private readonly eventBus;
    private static readonly SESSION_DURATION_MINUTES;
    private static readonly QUESTIONS_PER_SESSION;
    constructor(sessionRepository: IQuizSessionRepository, questionRepository: IQuestionRepository, eventBus: EventBusService);
    execute(command: StartQuizSessionCommand): Promise<StartQuizSessionResult>;
}

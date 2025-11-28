import { ICommandHandler } from '@nestjs/cqrs';
import { SubmitAnswerCommand } from './submit-answer.command';
import { IQuizSessionRepository } from '../../domain/repositories/quiz-session.repository.interface';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
export interface SubmitAnswerResult {
    sessionId: string;
    questionId: string;
    answerId: string;
    isCorrect: boolean;
    pointsEarned: number;
    timeBonus: number;
    correctAnswerId: string;
}
export declare class SubmitAnswerHandler implements ICommandHandler<SubmitAnswerCommand, SubmitAnswerResult> {
    private readonly sessionRepository;
    private readonly questionRepository;
    private static readonly BASE_POINTS;
    private static readonly MAX_TIME_BONUS;
    private static readonly TIME_BONUS_THRESHOLD_MS;
    constructor(sessionRepository: IQuizSessionRepository, questionRepository: IQuestionRepository);
    execute(command: SubmitAnswerCommand): Promise<SubmitAnswerResult>;
}

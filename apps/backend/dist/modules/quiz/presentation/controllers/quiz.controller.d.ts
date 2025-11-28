import { CommandBus } from '@nestjs/cqrs';
import { StartQuizDto, SubmitAnswerDto, StartQuizResponseDto, SubmitAnswerResponseDto, CompleteQuizResponseDto } from '../dtos';
export declare class QuizController {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    startQuiz(user: any, dto: StartQuizDto): Promise<StartQuizResponseDto>;
    submitAnswer(sessionId: string, dto: SubmitAnswerDto): Promise<SubmitAnswerResponseDto>;
    completeQuiz(sessionId: string): Promise<CompleteQuizResponseDto>;
}

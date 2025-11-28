import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionDto, CreateQuestionResponseDto } from '../dtos';
export declare class QuestionController {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    createQuestion(user: any, dto: CreateQuestionDto): Promise<CreateQuestionResponseDto>;
}

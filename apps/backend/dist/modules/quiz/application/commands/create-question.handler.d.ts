import { ICommandHandler } from '@nestjs/cqrs';
import { CreateQuestionCommand } from './create-question.command';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
export interface CreateQuestionResult {
    questionId: string;
    text: string;
    categoryId: string;
    difficultyId: string;
}
export declare class CreateQuestionHandler implements ICommandHandler<CreateQuestionCommand, CreateQuestionResult> {
    private readonly questionRepository;
    private readonly eventBus;
    constructor(questionRepository: IQuestionRepository, eventBus: EventBusService);
    execute(command: CreateQuestionCommand): Promise<CreateQuestionResult>;
}

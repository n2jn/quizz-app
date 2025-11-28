import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
export declare class QuizSessionStartedEconomyHandler {
    private readonly livesRepository;
    private readonly eventBus;
    private readonly logger;
    constructor(livesRepository: ILivesRepository, eventBus: EventBusService);
    handle(event: any): Promise<void>;
}

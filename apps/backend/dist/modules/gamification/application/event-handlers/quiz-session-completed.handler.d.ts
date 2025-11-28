import { IPlayerProgressRepository } from '../../domain/repositories/player-progress.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
export declare class QuizSessionCompletedGamificationHandler {
    private readonly progressRepository;
    private readonly eventBus;
    private readonly logger;
    private static readonly XP_PER_CORRECT;
    constructor(progressRepository: IPlayerProgressRepository, eventBus: EventBusService);
    handle(event: any): Promise<void>;
}

import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
export declare class QuizSessionCompletedEconomyHandler {
    private readonly walletRepository;
    private readonly eventBus;
    private readonly logger;
    private static readonly COINS_PER_CORRECT;
    private static readonly PERFECT_SCORE_BONUS;
    constructor(walletRepository: IWalletRepository, eventBus: EventBusService);
    handle(event: any): Promise<void>;
}

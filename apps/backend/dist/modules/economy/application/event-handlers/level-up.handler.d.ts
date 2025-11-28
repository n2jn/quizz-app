import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
export declare class LevelUpEconomyHandler {
    private readonly walletRepository;
    private readonly eventBus;
    private readonly logger;
    private static readonly LEVEL_UP_BONUS;
    constructor(walletRepository: IWalletRepository, eventBus: EventBusService);
    handle(event: any): Promise<void>;
}

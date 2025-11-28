import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';
export declare class UserRegisteredEconomyHandler {
    private readonly walletRepository;
    private readonly livesRepository;
    private readonly logger;
    constructor(walletRepository: IWalletRepository, livesRepository: ILivesRepository);
    handle(event: any): Promise<void>;
}

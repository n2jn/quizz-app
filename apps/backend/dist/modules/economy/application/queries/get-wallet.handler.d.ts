import { IQueryHandler } from '@nestjs/cqrs';
import { GetWalletQuery } from './get-wallet.query';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
export interface GetWalletResult {
    balance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
}
export declare class GetWalletHandler implements IQueryHandler<GetWalletQuery, GetWalletResult> {
    private readonly walletRepository;
    constructor(walletRepository: IWalletRepository);
    execute(query: GetWalletQuery): Promise<GetWalletResult>;
}

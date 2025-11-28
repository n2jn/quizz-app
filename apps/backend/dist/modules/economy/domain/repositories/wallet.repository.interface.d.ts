import { Wallet } from '../aggregates/wallet.aggregate';
export interface IWalletRepository {
    save(wallet: Wallet): Promise<void>;
    findByUserId(userId: string): Promise<Wallet | null>;
    getOrCreate(userId: string): Promise<Wallet>;
}

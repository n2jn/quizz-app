import { Wallet } from '../aggregates/wallet.aggregate';

/**
 * Wallet Repository Interface
 *
 * Defines contract for wallet persistence operations.
 */
export interface IWalletRepository {
  save(wallet: Wallet): Promise<void>;
  findByUserId(userId: string): Promise<Wallet | null>;
  getOrCreate(userId: string): Promise<Wallet>;
}

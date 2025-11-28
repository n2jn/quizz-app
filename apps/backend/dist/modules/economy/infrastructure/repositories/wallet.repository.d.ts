import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { Wallet } from '../../domain/aggregates/wallet.aggregate';
export declare class WalletRepository implements IWalletRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(wallet: Wallet): Promise<void>;
    findByUserId(userId: string): Promise<Wallet | null>;
    getOrCreate(userId: string): Promise<Wallet>;
}

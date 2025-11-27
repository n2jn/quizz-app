import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { Wallet } from '../../domain/aggregates/wallet.aggregate';
import { v4 as uuidv4 } from 'uuid';

/**
 * Wallet Repository Implementation
 *
 * Implements persistence for Wallet aggregate using Prisma.
 */
@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(wallet: Wallet): Promise<void> {
    await this.prisma.wallet.upsert({
      where: { userId: wallet.userId },
      create: {
        id: wallet.id,
        userId: wallet.userId,
        balance: wallet.balance,
        lifetimeEarned: wallet.lifetimeEarned,
        lifetimeSpent: wallet.lifetimeSpent,
      },
      update: {
        balance: wallet.balance,
        lifetimeEarned: wallet.lifetimeEarned,
        lifetimeSpent: wallet.lifetimeSpent,
        updatedAt: new Date(),
      },
    });
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const walletData = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!walletData) {
      return null;
    }

    return Wallet.fromPersistence({
      id: walletData.id,
      userId: walletData.userId,
      balance: walletData.balance,
      lifetimeEarned: walletData.lifetimeEarned,
      lifetimeSpent: walletData.lifetimeSpent,
      createdAt: walletData.createdAt,
      updatedAt: walletData.updatedAt,
    });
  }

  async getOrCreate(userId: string): Promise<Wallet> {
    let wallet = await this.findByUserId(userId);

    if (!wallet) {
      wallet = Wallet.create(uuidv4(), userId);
      await this.save(wallet);
    }

    return wallet;
  }
}

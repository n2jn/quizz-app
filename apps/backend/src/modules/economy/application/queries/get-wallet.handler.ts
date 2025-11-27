import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { GetWalletQuery } from './get-wallet.query';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';

export interface GetWalletResult {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

/**
 * Get Wallet Query Handler
 *
 * Returns user's wallet information.
 */
@Injectable()
@QueryHandler(GetWalletQuery)
export class GetWalletHandler implements IQueryHandler<GetWalletQuery, GetWalletResult> {
  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(query: GetWalletQuery): Promise<GetWalletResult> {
    const wallet = await this.walletRepository.getOrCreate(query.userId);

    return {
      balance: wallet.balance,
      lifetimeEarned: wallet.lifetimeEarned,
      lifetimeSpent: wallet.lifetimeSpent,
    };
  }
}

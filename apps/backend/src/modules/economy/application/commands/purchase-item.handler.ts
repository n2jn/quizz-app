import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PurchaseItemCommand } from './purchase-item.command';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';

export interface PurchaseItemResult {
  itemId: string;
  itemName: string;
  price: number;
  balanceAfter: number;
}

/**
 * Purchase Item Command Handler
 *
 * Handles shop item purchases:
 * 1. Validate item exists and is available
 * 2. Check user has sufficient balance
 * 3. Deduct coins from wallet
 * 4. Apply item effect (restore life, etc.)
 * 5. Record transaction
 * 6. Publish events
 */
@Injectable()
@CommandHandler(PurchaseItemCommand)
export class PurchaseItemHandler
  implements ICommandHandler<PurchaseItemCommand, PurchaseItemResult>
{
  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
    @Inject('ILivesRepository')
    private readonly livesRepository: ILivesRepository,
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: PurchaseItemCommand): Promise<PurchaseItemResult> {
    // Get item
    const item = await this.prisma.shopItem.findUnique({
      where: { id: command.itemId },
    });

    if (!item) {
      throw new NotFoundException('Shop item not found');
    }

    if (!item.available) {
      throw new BadRequestException('Item is not available for purchase');
    }

    // Get wallet
    const wallet = await this.walletRepository.getOrCreate(command.userId);

    // Check balance
    if (!wallet.hasBalance(item.price)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Spend coins
    wallet.spendCoins(item.price, 'shop_purchase', `Purchased ${item.name}`);

    // Apply item effect
    await this.applyItemEffect(command.userId, item.type);

    // Save wallet
    await this.walletRepository.save(wallet);

    // Record transaction
    await this.prisma.transaction.create({
      data: {
        userId: command.userId,
        type: 'SPENT',
        amount: item.price,
        source: 'shop_purchase',
        description: `Purchased ${item.name}`,
        balanceAfter: wallet.balance,
      },
    });

    // Publish events
    await this.eventBus.publishAll([...wallet.domainEvents]);
    wallet.clearEvents();

    return {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      balanceAfter: wallet.balance,
    };
  }

  private async applyItemEffect(userId: string, itemType: string): Promise<void> {
    switch (itemType) {
      case 'LIFE':
        const lives = await this.livesRepository.getOrCreate(userId);
        lives.restoreLife(true);
        await this.livesRepository.save(lives);
        await this.eventBus.publishAll([...lives.domainEvents]);
        lives.clearEvents();
        break;
      // Future: Handle other item types (powerups, streak freeze, etc.)
      default:
        break;
    }
  }
}

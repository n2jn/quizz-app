import { ICommandHandler } from '@nestjs/cqrs';
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
export declare class PurchaseItemHandler implements ICommandHandler<PurchaseItemCommand, PurchaseItemResult> {
    private readonly walletRepository;
    private readonly livesRepository;
    private readonly prisma;
    private readonly eventBus;
    constructor(walletRepository: IWalletRepository, livesRepository: ILivesRepository, prisma: PrismaService, eventBus: EventBusService);
    execute(command: PurchaseItemCommand): Promise<PurchaseItemResult>;
    private applyItemEffect;
}

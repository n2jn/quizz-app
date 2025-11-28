import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { PurchaseItemDto, PurchaseItemResponseDto, WalletResponseDto, LivesResponseDto, ShopItemDto } from '../dtos/purchase-item.dto';
export declare class EconomyController {
    private readonly commandBus;
    private readonly queryBus;
    private readonly prisma;
    constructor(commandBus: CommandBus, queryBus: QueryBus, prisma: PrismaService);
    getWallet(user: any): Promise<WalletResponseDto>;
    getLives(user: any): Promise<LivesResponseDto>;
    getShopItems(): Promise<ShopItemDto[]>;
    purchaseItem(user: any, dto: PurchaseItemDto): Promise<PurchaseItemResponseDto>;
}

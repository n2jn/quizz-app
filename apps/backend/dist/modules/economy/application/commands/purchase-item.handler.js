"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseItemHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const purchase_item_command_1 = require("./purchase-item.command");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
let PurchaseItemHandler = class PurchaseItemHandler {
    constructor(walletRepository, livesRepository, prisma, eventBus) {
        this.walletRepository = walletRepository;
        this.livesRepository = livesRepository;
        this.prisma = prisma;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const item = await this.prisma.shopItem.findUnique({
            where: { id: command.itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Shop item not found');
        }
        if (!item.available) {
            throw new common_1.BadRequestException('Item is not available for purchase');
        }
        const wallet = await this.walletRepository.getOrCreate(command.userId);
        if (!wallet.hasBalance(item.price)) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        wallet.spendCoins(item.price, 'shop_purchase', `Purchased ${item.name}`);
        await this.applyItemEffect(command.userId, item.type);
        await this.walletRepository.save(wallet);
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
        await this.eventBus.publishAll([...wallet.domainEvents]);
        wallet.clearEvents();
        return {
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            balanceAfter: wallet.balance,
        };
    }
    async applyItemEffect(userId, itemType) {
        switch (itemType) {
            case 'LIFE':
                const lives = await this.livesRepository.getOrCreate(userId);
                lives.restoreLife(true);
                await this.livesRepository.save(lives);
                await this.eventBus.publishAll([...lives.domainEvents]);
                lives.clearEvents();
                break;
            default:
                break;
        }
    }
};
exports.PurchaseItemHandler = PurchaseItemHandler;
exports.PurchaseItemHandler = PurchaseItemHandler = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(purchase_item_command_1.PurchaseItemCommand),
    __param(0, (0, common_1.Inject)('IWalletRepository')),
    __param(1, (0, common_1.Inject)('ILivesRepository')),
    __metadata("design:paramtypes", [Object, Object, prisma_service_1.PrismaService,
        event_bus_service_1.EventBusService])
], PurchaseItemHandler);
//# sourceMappingURL=purchase-item.handler.js.map
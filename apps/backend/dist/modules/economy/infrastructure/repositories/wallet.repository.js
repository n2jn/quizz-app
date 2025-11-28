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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const wallet_aggregate_1 = require("../../domain/aggregates/wallet.aggregate");
const uuid_1 = require("uuid");
let WalletRepository = class WalletRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(wallet) {
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
    async findByUserId(userId) {
        const walletData = await this.prisma.wallet.findUnique({
            where: { userId },
        });
        if (!walletData) {
            return null;
        }
        return wallet_aggregate_1.Wallet.fromPersistence({
            id: walletData.id,
            userId: walletData.userId,
            balance: walletData.balance,
            lifetimeEarned: walletData.lifetimeEarned,
            lifetimeSpent: walletData.lifetimeSpent,
            createdAt: walletData.createdAt,
            updatedAt: walletData.updatedAt,
        });
    }
    async getOrCreate(userId) {
        let wallet = await this.findByUserId(userId);
        if (!wallet) {
            wallet = wallet_aggregate_1.Wallet.create((0, uuid_1.v4)(), userId);
            await this.save(wallet);
        }
        return wallet;
    }
};
exports.WalletRepository = WalletRepository;
exports.WalletRepository = WalletRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletRepository);
//# sourceMappingURL=wallet.repository.js.map
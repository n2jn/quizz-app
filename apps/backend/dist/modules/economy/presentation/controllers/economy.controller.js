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
exports.EconomyController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../shared/presentation/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../../../shared/presentation/decorators/current-user.decorator");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const purchase_item_dto_1 = require("../dtos/purchase-item.dto");
const purchase_item_command_1 = require("../../application/commands/purchase-item.command");
const get_wallet_query_1 = require("../../application/queries/get-wallet.query");
const get_lives_query_1 = require("../../application/queries/get-lives.query");
let EconomyController = class EconomyController {
    constructor(commandBus, queryBus, prisma) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.prisma = prisma;
    }
    async getWallet(user) {
        return this.queryBus.execute(new get_wallet_query_1.GetWalletQuery(user.userId));
    }
    async getLives(user) {
        return this.queryBus.execute(new get_lives_query_1.GetLivesQuery(user.userId));
    }
    async getShopItems() {
        const items = await this.prisma.shopItem.findMany({
            where: { available: true },
        });
        return items.map((item) => ({
            id: item.id,
            type: item.type,
            name: item.name,
            description: item.description,
            price: item.price,
            available: item.available,
        }));
    }
    async purchaseItem(user, dto) {
        return this.commandBus.execute(new purchase_item_command_1.PurchaseItemCommand(user.userId, dto.itemId));
    }
};
exports.EconomyController = EconomyController;
__decorate([
    (0, common_1.Get)('wallet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user wallet information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Wallet information retrieved',
        type: purchase_item_dto_1.WalletResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Get)('lives'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user lives status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lives status retrieved',
        type: purchase_item_dto_1.LivesResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "getLives", null);
__decorate([
    (0, common_1.Get)('shop'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available shop items' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shop items retrieved',
        type: [purchase_item_dto_1.ShopItemDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "getShopItems", null);
__decorate([
    (0, common_1.Post)('shop/purchase'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Purchase a shop item' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Item purchased successfully',
        type: purchase_item_dto_1.PurchaseItemResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient balance or item unavailable' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, purchase_item_dto_1.PurchaseItemDto]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "purchaseItem", null);
exports.EconomyController = EconomyController = __decorate([
    (0, swagger_1.ApiTags)('economy'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('economy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        prisma_service_1.PrismaService])
], EconomyController);
//# sourceMappingURL=economy.controller.js.map
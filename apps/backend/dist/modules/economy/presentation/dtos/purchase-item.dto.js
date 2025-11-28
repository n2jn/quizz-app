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
exports.ShopItemDto = exports.LivesResponseDto = exports.WalletResponseDto = exports.PurchaseItemResponseDto = exports.PurchaseItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PurchaseItemDto {
}
exports.PurchaseItemDto = PurchaseItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'item-uuid', description: 'Shop item ID to purchase' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PurchaseItemDto.prototype, "itemId", void 0);
class PurchaseItemResponseDto {
}
exports.PurchaseItemResponseDto = PurchaseItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'item-uuid', description: 'Purchased item ID' }),
    __metadata("design:type", String)
], PurchaseItemResponseDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Extra Life', description: 'Item name' }),
    __metadata("design:type", String)
], PurchaseItemResponseDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Price paid' }),
    __metadata("design:type", Number)
], PurchaseItemResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450, description: 'Balance after purchase' }),
    __metadata("design:type", Number)
], PurchaseItemResponseDto.prototype, "balanceAfter", void 0);
class WalletResponseDto {
}
exports.WalletResponseDto = WalletResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 550, description: 'Current balance' }),
    __metadata("design:type", Number)
], WalletResponseDto.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200, description: 'Total coins earned' }),
    __metadata("design:type", Number)
], WalletResponseDto.prototype, "lifetimeEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 650, description: 'Total coins spent' }),
    __metadata("design:type", Number)
], WalletResponseDto.prototype, "lifetimeSpent", void 0);
class LivesResponseDto {
}
exports.LivesResponseDto = LivesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Current lives' }),
    __metadata("design:type", Number)
], LivesResponseDto.prototype, "currentLives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Maximum lives' }),
    __metadata("design:type", Number)
], LivesResponseDto.prototype, "maxLives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T12:00:00Z',
        description: 'Last regeneration time',
        nullable: true,
    }),
    __metadata("design:type", Object)
], LivesResponseDto.prototype, "lastRegenAt", void 0);
class ShopItemDto {
}
exports.ShopItemDto = ShopItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'item-uuid', description: 'Item ID' }),
    __metadata("design:type", String)
], ShopItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LIFE', description: 'Item type' }),
    __metadata("design:type", String)
], ShopItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Extra Life', description: 'Item name' }),
    __metadata("design:type", String)
], ShopItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Restore one life to your health bar', description: 'Item description' }),
    __metadata("design:type", String)
], ShopItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Price in coins' }),
    __metadata("design:type", Number)
], ShopItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether item is available' }),
    __metadata("design:type", Boolean)
], ShopItemDto.prototype, "available", void 0);
//# sourceMappingURL=purchase-item.dto.js.map
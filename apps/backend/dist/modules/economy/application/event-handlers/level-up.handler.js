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
var LevelUpEconomyHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelUpEconomyHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
let LevelUpEconomyHandler = LevelUpEconomyHandler_1 = class LevelUpEconomyHandler {
    constructor(walletRepository, eventBus) {
        this.walletRepository = walletRepository;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(LevelUpEconomyHandler_1.name);
    }
    async handle(event) {
        const { userId, newLevel } = event.props;
        this.logger.log(`Awarding level up bonus for user: ${userId} (Level ${newLevel})`);
        try {
            const wallet = await this.walletRepository.getOrCreate(userId);
            wallet.addCoins(LevelUpEconomyHandler_1.LEVEL_UP_BONUS, 'level_up_bonus', `Reached Level ${newLevel}!`);
            await this.walletRepository.save(wallet);
            await this.eventBus.publishAll([...wallet.domainEvents]);
            wallet.clearEvents();
            this.logger.log(`Awarded ${LevelUpEconomyHandler_1.LEVEL_UP_BONUS} coins to user: ${userId}`);
        }
        catch (error) {
            this.logger.error(`Failed to award level up bonus for user: ${userId}`, error);
            throw error;
        }
    }
};
exports.LevelUpEconomyHandler = LevelUpEconomyHandler;
LevelUpEconomyHandler.LEVEL_UP_BONUS = 100;
__decorate([
    (0, event_emitter_1.OnEvent)('player.level_up'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LevelUpEconomyHandler.prototype, "handle", null);
exports.LevelUpEconomyHandler = LevelUpEconomyHandler = LevelUpEconomyHandler_1 = __decorate([
    __param(0, (0, common_1.Inject)('IWalletRepository')),
    __metadata("design:paramtypes", [Object, event_bus_service_1.EventBusService])
], LevelUpEconomyHandler);
//# sourceMappingURL=level-up.handler.js.map
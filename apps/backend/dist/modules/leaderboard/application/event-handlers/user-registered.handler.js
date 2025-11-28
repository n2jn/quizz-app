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
var UserRegisteredLeaderboardHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisteredLeaderboardHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let UserRegisteredLeaderboardHandler = UserRegisteredLeaderboardHandler_1 = class UserRegisteredLeaderboardHandler {
    constructor(rankingRepository) {
        this.rankingRepository = rankingRepository;
        this.logger = new common_1.Logger(UserRegisteredLeaderboardHandler_1.name);
    }
    async handle(event) {
        this.logger.log(`Creating player ranking for user: ${event.props.userId}`);
        try {
            await this.rankingRepository.getOrCreate(event.props.userId);
            this.logger.log(`Player ranking initialized for user: ${event.props.userId}`);
        }
        catch (error) {
            this.logger.error(`Failed to initialize player ranking for user: ${event.props.userId}`, error);
            throw error;
        }
    }
};
exports.UserRegisteredLeaderboardHandler = UserRegisteredLeaderboardHandler;
__decorate([
    (0, event_emitter_1.OnEvent)('user.registered'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRegisteredLeaderboardHandler.prototype, "handle", null);
exports.UserRegisteredLeaderboardHandler = UserRegisteredLeaderboardHandler = UserRegisteredLeaderboardHandler_1 = __decorate([
    __param(0, (0, common_1.Inject)('IPlayerRankingRepository')),
    __metadata("design:paramtypes", [Object])
], UserRegisteredLeaderboardHandler);
//# sourceMappingURL=user-registered.handler.js.map
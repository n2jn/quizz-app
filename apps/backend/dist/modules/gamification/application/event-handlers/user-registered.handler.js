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
var UserRegisteredGamificationHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisteredGamificationHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let UserRegisteredGamificationHandler = UserRegisteredGamificationHandler_1 = class UserRegisteredGamificationHandler {
    constructor(progressRepository) {
        this.progressRepository = progressRepository;
        this.logger = new common_1.Logger(UserRegisteredGamificationHandler_1.name);
    }
    async handle(event) {
        this.logger.log(`Creating player progress for user: ${event.props.userId}`);
        try {
            await this.progressRepository.getOrCreate(event.props.userId);
            this.logger.log(`Player progress initialized for user: ${event.props.userId}`);
        }
        catch (error) {
            this.logger.error(`Failed to initialize player progress for user: ${event.props.userId}`, error);
            throw error;
        }
    }
};
exports.UserRegisteredGamificationHandler = UserRegisteredGamificationHandler;
__decorate([
    (0, event_emitter_1.OnEvent)('user.registered'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRegisteredGamificationHandler.prototype, "handle", null);
exports.UserRegisteredGamificationHandler = UserRegisteredGamificationHandler = UserRegisteredGamificationHandler_1 = __decorate([
    __param(0, (0, common_1.Inject)('IPlayerProgressRepository')),
    __metadata("design:paramtypes", [Object])
], UserRegisteredGamificationHandler);
//# sourceMappingURL=user-registered.handler.js.map
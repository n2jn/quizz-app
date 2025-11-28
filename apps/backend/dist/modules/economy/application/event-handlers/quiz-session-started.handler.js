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
var QuizSessionStartedEconomyHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionStartedEconomyHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
let QuizSessionStartedEconomyHandler = QuizSessionStartedEconomyHandler_1 = class QuizSessionStartedEconomyHandler {
    constructor(livesRepository, eventBus) {
        this.livesRepository = livesRepository;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(QuizSessionStartedEconomyHandler_1.name);
    }
    async handle(event) {
        const { userId, sessionId } = event.props;
        this.logger.log(`Consuming life for quiz session: ${sessionId} (user: ${userId})`);
        try {
            const lives = await this.livesRepository.getOrCreate(userId);
            lives.regenerateLives();
            if (!lives.hasLives()) {
                this.logger.warn(`User ${userId} has no lives available`);
                throw new common_1.BadRequestException('No lives available');
            }
            lives.consumeLife();
            await this.livesRepository.save(lives);
            await this.eventBus.publishAll([...lives.domainEvents]);
            lives.clearEvents();
            this.logger.log(`Life consumed for user: ${userId}. Lives remaining: ${lives.currentLives}`);
        }
        catch (error) {
            this.logger.error(`Failed to consume life for user: ${userId}`, error);
            throw error;
        }
    }
};
exports.QuizSessionStartedEconomyHandler = QuizSessionStartedEconomyHandler;
__decorate([
    (0, event_emitter_1.OnEvent)('quiz.session.started'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizSessionStartedEconomyHandler.prototype, "handle", null);
exports.QuizSessionStartedEconomyHandler = QuizSessionStartedEconomyHandler = QuizSessionStartedEconomyHandler_1 = __decorate([
    __param(0, (0, common_1.Inject)('ILivesRepository')),
    __metadata("design:paramtypes", [Object, event_bus_service_1.EventBusService])
], QuizSessionStartedEconomyHandler);
//# sourceMappingURL=quiz-session-started.handler.js.map
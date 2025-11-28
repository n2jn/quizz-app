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
var QuizSessionCompletedEconomyHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionCompletedEconomyHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
let QuizSessionCompletedEconomyHandler = QuizSessionCompletedEconomyHandler_1 = class QuizSessionCompletedEconomyHandler {
    constructor(walletRepository, eventBus) {
        this.walletRepository = walletRepository;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(QuizSessionCompletedEconomyHandler_1.name);
    }
    async handle(event) {
        const { userId, correctAnswers, totalQuestions } = event.props;
        this.logger.log(`Awarding coins for quiz: ${correctAnswers}/${totalQuestions} correct (user: ${userId})`);
        try {
            const wallet = await this.walletRepository.getOrCreate(userId);
            const baseCoins = correctAnswers * QuizSessionCompletedEconomyHandler_1.COINS_PER_CORRECT;
            wallet.addCoins(baseCoins, 'quiz_reward', `Answered ${correctAnswers} questions correctly`);
            if (event.props.isPerfectScore) {
                wallet.addCoins(QuizSessionCompletedEconomyHandler_1.PERFECT_SCORE_BONUS, 'perfect_score_bonus', 'Perfect quiz score!');
            }
            await this.walletRepository.save(wallet);
            await this.eventBus.publishAll([...wallet.domainEvents]);
            wallet.clearEvents();
            const totalCoins = baseCoins + (event.props.isPerfectScore ? QuizSessionCompletedEconomyHandler_1.PERFECT_SCORE_BONUS : 0);
            this.logger.log(`Awarded ${totalCoins} coins to user: ${userId}`);
        }
        catch (error) {
            this.logger.error(`Failed to award coins for user: ${userId}`, error);
            throw error;
        }
    }
};
exports.QuizSessionCompletedEconomyHandler = QuizSessionCompletedEconomyHandler;
QuizSessionCompletedEconomyHandler.COINS_PER_CORRECT = 10;
QuizSessionCompletedEconomyHandler.PERFECT_SCORE_BONUS = 50;
__decorate([
    (0, event_emitter_1.OnEvent)('quiz.session.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizSessionCompletedEconomyHandler.prototype, "handle", null);
exports.QuizSessionCompletedEconomyHandler = QuizSessionCompletedEconomyHandler = QuizSessionCompletedEconomyHandler_1 = __decorate([
    __param(0, (0, common_1.Inject)('IWalletRepository')),
    __metadata("design:paramtypes", [Object, event_bus_service_1.EventBusService])
], QuizSessionCompletedEconomyHandler);
//# sourceMappingURL=quiz-session-completed.handler.js.map
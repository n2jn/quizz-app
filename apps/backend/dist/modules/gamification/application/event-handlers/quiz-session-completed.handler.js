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
var QuizSessionCompletedGamificationHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionCompletedGamificationHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
let QuizSessionCompletedGamificationHandler = QuizSessionCompletedGamificationHandler_1 = class QuizSessionCompletedGamificationHandler {
    constructor(progressRepository, eventBus) {
        this.progressRepository = progressRepository;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(QuizSessionCompletedGamificationHandler_1.name);
    }
    async handle(event) {
        const { userId, correctAnswers, totalQuestions } = event.props;
        this.logger.log(`Updating progress for quiz: ${correctAnswers}/${totalQuestions} (user: ${userId})`);
        try {
            const progress = await this.progressRepository.getOrCreate(userId);
            const xpEarned = correctAnswers * QuizSessionCompletedGamificationHandler_1.XP_PER_CORRECT;
            progress.addXP(xpEarned);
            progress.recordQuizCompletion(correctAnswers, totalQuestions);
            progress.incrementStreak();
            await this.progressRepository.save(progress);
            await this.eventBus.publishAll([...progress.domainEvents]);
            progress.clearEvents();
            this.logger.log(`Progress updated for user ${userId}: +${xpEarned} XP, Level ${progress.currentLevel}, Streak ${progress.currentStreak}`);
        }
        catch (error) {
            this.logger.error(`Failed to update progress for user: ${userId}`, error);
            throw error;
        }
    }
};
exports.QuizSessionCompletedGamificationHandler = QuizSessionCompletedGamificationHandler;
QuizSessionCompletedGamificationHandler.XP_PER_CORRECT = 50;
__decorate([
    (0, event_emitter_1.OnEvent)('quiz.session.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizSessionCompletedGamificationHandler.prototype, "handle", null);
exports.QuizSessionCompletedGamificationHandler = QuizSessionCompletedGamificationHandler = QuizSessionCompletedGamificationHandler_1 = __decorate([
    __param(0, (0, common_1.Inject)('IPlayerProgressRepository')),
    __metadata("design:paramtypes", [Object, event_bus_service_1.EventBusService])
], QuizSessionCompletedGamificationHandler);
//# sourceMappingURL=quiz-session-completed.handler.js.map
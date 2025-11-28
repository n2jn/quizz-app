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
exports.CompleteQuizSessionHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const complete_quiz_session_command_1 = require("./complete-quiz-session.command");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
let CompleteQuizSessionHandler = class CompleteQuizSessionHandler {
    constructor(sessionRepository, eventBus) {
        this.sessionRepository = sessionRepository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const session = await this.sessionRepository.findById(command.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Quiz session not found');
        }
        session.complete();
        await this.sessionRepository.save(session);
        await this.eventBus.publishAll([...session.domainEvents]);
        session.clearEvents();
        const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
        return {
            sessionId: session.id,
            userId: session.userId,
            score: session.score,
            totalQuestions: session.answers.length,
            correctAnswers,
            completedAt: session.completedAt,
        };
    }
};
exports.CompleteQuizSessionHandler = CompleteQuizSessionHandler;
exports.CompleteQuizSessionHandler = CompleteQuizSessionHandler = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(complete_quiz_session_command_1.CompleteQuizSessionCommand),
    __param(0, (0, common_1.Inject)('IQuizSessionRepository')),
    __metadata("design:paramtypes", [Object, event_bus_service_1.EventBusService])
], CompleteQuizSessionHandler);
//# sourceMappingURL=complete-quiz-session.handler.js.map
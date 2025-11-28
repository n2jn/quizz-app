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
var StartQuizSessionHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartQuizSessionHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const start_quiz_session_command_1 = require("./start-quiz-session.command");
const quiz_session_aggregate_1 = require("../../domain/aggregates/quiz-session.aggregate");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
const uuid_1 = require("uuid");
let StartQuizSessionHandler = StartQuizSessionHandler_1 = class StartQuizSessionHandler {
    constructor(sessionRepository, questionRepository, eventBus) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const activeSession = await this.sessionRepository.findActiveByUserId(command.userId);
        if (activeSession) {
            throw new common_1.BadRequestException('User already has an active quiz session');
        }
        const questions = await this.questionRepository.findRandomQuestions(command.difficultyId, command.categoryId || null, StartQuizSessionHandler_1.QUESTIONS_PER_SESSION);
        if (questions.length < StartQuizSessionHandler_1.QUESTIONS_PER_SESSION) {
            throw new common_1.BadRequestException('Not enough questions available for this difficulty/category');
        }
        const sessionId = (0, uuid_1.v4)();
        const session = quiz_session_aggregate_1.QuizSession.create(sessionId, command.userId, command.categoryId || null, command.difficultyId, StartQuizSessionHandler_1.SESSION_DURATION_MINUTES);
        await this.sessionRepository.save(session);
        await this.eventBus.publishAll([...session.domainEvents]);
        session.clearEvents();
        const questionData = questions.map((q) => ({
            id: q.id,
            text: q.text.value,
            imageUrl: q.imageUrl,
            answers: q.answers.map((a) => ({
                id: a.id,
                text: a.text,
            })),
        }));
        return {
            sessionId: session.id,
            userId: command.userId,
            difficultyId: command.difficultyId,
            categoryId: command.categoryId || null,
            questions: questionData,
            expiresAt: session.expiresAt,
        };
    }
};
exports.StartQuizSessionHandler = StartQuizSessionHandler;
StartQuizSessionHandler.SESSION_DURATION_MINUTES = 30;
StartQuizSessionHandler.QUESTIONS_PER_SESSION = 10;
exports.StartQuizSessionHandler = StartQuizSessionHandler = StartQuizSessionHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(start_quiz_session_command_1.StartQuizSessionCommand),
    __param(0, (0, common_1.Inject)('IQuizSessionRepository')),
    __param(1, (0, common_1.Inject)('IQuestionRepository')),
    __metadata("design:paramtypes", [Object, Object, event_bus_service_1.EventBusService])
], StartQuizSessionHandler);
//# sourceMappingURL=start-quiz-session.handler.js.map
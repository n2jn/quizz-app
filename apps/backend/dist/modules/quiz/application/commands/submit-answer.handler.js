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
var SubmitAnswerHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitAnswerHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const submit_answer_command_1 = require("./submit-answer.command");
let SubmitAnswerHandler = SubmitAnswerHandler_1 = class SubmitAnswerHandler {
    constructor(sessionRepository, questionRepository) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
    }
    async execute(command) {
        const session = await this.sessionRepository.findById(command.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Quiz session not found');
        }
        const question = await this.questionRepository.findById(command.questionId);
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        const answer = question.answers.find((a) => a.id === command.answerId);
        if (!answer) {
            throw new common_1.BadRequestException('Invalid answer for question');
        }
        const isCorrect = answer.isCorrect;
        let pointsEarned = 0;
        let timeBonus = 0;
        if (isCorrect) {
            pointsEarned = SubmitAnswerHandler_1.BASE_POINTS;
            if (command.timeSpent < SubmitAnswerHandler_1.TIME_BONUS_THRESHOLD_MS) {
                const timeFactor = 1 - command.timeSpent / SubmitAnswerHandler_1.TIME_BONUS_THRESHOLD_MS;
                timeBonus = Math.floor(SubmitAnswerHandler_1.MAX_TIME_BONUS * timeFactor);
            }
        }
        const sessionAnswer = {
            questionId: command.questionId,
            answerId: command.answerId,
            isCorrect,
            timeSpent: command.timeSpent,
            pointsEarned,
            timeBonus,
        };
        session.submitAnswer(sessionAnswer);
        await this.sessionRepository.save(session);
        const correctAnswer = question.answers.find((a) => a.isCorrect);
        return {
            sessionId: command.sessionId,
            questionId: command.questionId,
            answerId: command.answerId,
            isCorrect,
            pointsEarned,
            timeBonus,
            correctAnswerId: correctAnswer.id,
        };
    }
};
exports.SubmitAnswerHandler = SubmitAnswerHandler;
SubmitAnswerHandler.BASE_POINTS = 100;
SubmitAnswerHandler.MAX_TIME_BONUS = 50;
SubmitAnswerHandler.TIME_BONUS_THRESHOLD_MS = 5000;
exports.SubmitAnswerHandler = SubmitAnswerHandler = SubmitAnswerHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(submit_answer_command_1.SubmitAnswerCommand),
    __param(0, (0, common_1.Inject)('IQuizSessionRepository')),
    __param(1, (0, common_1.Inject)('IQuestionRepository')),
    __metadata("design:paramtypes", [Object, Object])
], SubmitAnswerHandler);
//# sourceMappingURL=submit-answer.handler.js.map
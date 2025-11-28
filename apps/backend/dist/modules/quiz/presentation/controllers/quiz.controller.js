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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../shared/presentation/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../../../shared/presentation/decorators/current-user.decorator");
const dtos_1 = require("../dtos");
const start_quiz_session_command_1 = require("../../application/commands/start-quiz-session.command");
const submit_answer_command_1 = require("../../application/commands/submit-answer.command");
const complete_quiz_session_command_1 = require("../../application/commands/complete-quiz-session.command");
let QuizController = class QuizController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async startQuiz(user, dto) {
        const result = await this.commandBus.execute(new start_quiz_session_command_1.StartQuizSessionCommand(user.userId, dto.difficultyId, dto.categoryId));
        return result;
    }
    async submitAnswer(sessionId, dto) {
        const result = await this.commandBus.execute(new submit_answer_command_1.SubmitAnswerCommand(sessionId, dto.questionId, dto.answerId, dto.timeSpent));
        return result;
    }
    async completeQuiz(sessionId) {
        const result = await this.commandBus.execute(new complete_quiz_session_command_1.CompleteQuizSessionCommand(sessionId));
        return result;
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Start a new quiz session' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quiz session started successfully',
        type: dtos_1.StartQuizResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User already has active session or not enough questions' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.StartQuizDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "startQuiz", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/answer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit an answer for a question' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Answer submitted successfully',
        type: dtos_1.SubmitAnswerResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid answer or session expired' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session or question not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SubmitAnswerDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)('sessions/:sessionId/complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a quiz session' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quiz session completed successfully',
        type: dtos_1.CompleteQuizResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Session not in progress' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "completeQuiz", null);
exports.QuizController = QuizController = __decorate([
    (0, swagger_1.ApiTags)('quiz'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('quiz'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map
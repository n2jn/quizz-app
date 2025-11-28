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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuestionResponseDto = exports.CompleteQuizResponseDto = exports.SubmitAnswerResponseDto = exports.StartQuizResponseDto = exports.QuestionDto = exports.AnswerOptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AnswerOptionDto {
}
exports.AnswerOptionDto = AnswerOptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'answer-uuid', description: 'Answer ID' }),
    __metadata("design:type", String)
], AnswerOptionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Paris', description: 'Answer text' }),
    __metadata("design:type", String)
], AnswerOptionDto.prototype, "text", void 0);
class QuestionDto {
}
exports.QuestionDto = QuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'question-uuid', description: 'Question ID' }),
    __metadata("design:type", String)
], QuestionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What is the capital of France?', description: 'Question text' }),
    __metadata("design:type", String)
], QuestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/image.jpg',
        description: 'Optional image URL',
        nullable: true,
    }),
    __metadata("design:type", Object)
], QuestionDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AnswerOptionDto], description: 'Answer options' }),
    __metadata("design:type", Array)
], QuestionDto.prototype, "answers", void 0);
class StartQuizResponseDto {
}
exports.StartQuizResponseDto = StartQuizResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'session-uuid', description: 'Quiz session ID' }),
    __metadata("design:type", String)
], StartQuizResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-uuid', description: 'User ID' }),
    __metadata("design:type", String)
], StartQuizResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'diff-apprenti-uuid', description: 'Difficulty ID' }),
    __metadata("design:type", String)
], StartQuizResponseDto.prototype, "difficultyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'cat-geography-uuid',
        description: 'Category ID',
        nullable: true,
    }),
    __metadata("design:type", Object)
], StartQuizResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [QuestionDto], description: 'Quiz questions' }),
    __metadata("design:type", Array)
], StartQuizResponseDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T12:30:00Z', description: 'Session expiration time' }),
    __metadata("design:type", Date)
], StartQuizResponseDto.prototype, "expiresAt", void 0);
class SubmitAnswerResponseDto {
}
exports.SubmitAnswerResponseDto = SubmitAnswerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'session-uuid', description: 'Session ID' }),
    __metadata("design:type", String)
], SubmitAnswerResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'question-uuid', description: 'Question ID' }),
    __metadata("design:type", String)
], SubmitAnswerResponseDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'answer-uuid', description: 'Submitted answer ID' }),
    __metadata("design:type", String)
], SubmitAnswerResponseDto.prototype, "answerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether answer was correct' }),
    __metadata("design:type", Boolean)
], SubmitAnswerResponseDto.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Points earned for correct answer' }),
    __metadata("design:type", Number)
], SubmitAnswerResponseDto.prototype, "pointsEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Time bonus points' }),
    __metadata("design:type", Number)
], SubmitAnswerResponseDto.prototype, "timeBonus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'correct-answer-uuid', description: 'ID of correct answer' }),
    __metadata("design:type", String)
], SubmitAnswerResponseDto.prototype, "correctAnswerId", void 0);
class CompleteQuizResponseDto {
}
exports.CompleteQuizResponseDto = CompleteQuizResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'session-uuid', description: 'Session ID' }),
    __metadata("design:type", String)
], CompleteQuizResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-uuid', description: 'User ID' }),
    __metadata("design:type", String)
], CompleteQuizResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 850, description: 'Total score' }),
    __metadata("design:type", Number)
], CompleteQuizResponseDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Total number of questions' }),
    __metadata("design:type", Number)
], CompleteQuizResponseDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, description: 'Number of correct answers' }),
    __metadata("design:type", Number)
], CompleteQuizResponseDto.prototype, "correctAnswers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T12:30:00Z', description: 'Completion time' }),
    __metadata("design:type", Date)
], CompleteQuizResponseDto.prototype, "completedAt", void 0);
class CreateQuestionResponseDto {
}
exports.CreateQuestionResponseDto = CreateQuestionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'question-uuid', description: 'Question ID' }),
    __metadata("design:type", String)
], CreateQuestionResponseDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What is the capital of France?', description: 'Question text' }),
    __metadata("design:type", String)
], CreateQuestionResponseDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cat-geography-uuid', description: 'Category ID' }),
    __metadata("design:type", String)
], CreateQuestionResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'diff-apprenti-uuid', description: 'Difficulty ID' }),
    __metadata("design:type", String)
], CreateQuestionResponseDto.prototype, "difficultyId", void 0);
//# sourceMappingURL=quiz-response.dto.js.map
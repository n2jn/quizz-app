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
exports.CreateQuestionHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const create_question_command_1 = require("./create-question.command");
const question_text_vo_1 = require("../../domain/value-objects/question-text.vo");
const explanation_vo_1 = require("../../domain/value-objects/explanation.vo");
const question_aggregate_1 = require("../../domain/aggregates/question.aggregate");
const answer_entity_1 = require("../../domain/entities/answer.entity");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
const uuid_1 = require("uuid");
let CreateQuestionHandler = class CreateQuestionHandler {
    constructor(questionRepository, eventBus) {
        this.questionRepository = questionRepository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const questionText = question_text_vo_1.QuestionText.create(command.text);
        const explanation = explanation_vo_1.Explanation.create(command.explanation);
        const answers = command.answers.map((answerDto) => answer_entity_1.Answer.create((0, uuid_1.v4)(), answerDto.text, answerDto.isCorrect));
        const questionId = (0, uuid_1.v4)();
        const question = question_aggregate_1.Question.create(questionId, questionText, explanation, command.categoryId, command.difficultyId, command.createdById, answers, command.imageUrl || null);
        await this.questionRepository.save(question);
        await this.eventBus.publishAll([...question.domainEvents]);
        question.clearEvents();
        return {
            questionId: question.id,
            text: questionText.value,
            categoryId: command.categoryId,
            difficultyId: command.difficultyId,
        };
    }
};
exports.CreateQuestionHandler = CreateQuestionHandler;
exports.CreateQuestionHandler = CreateQuestionHandler = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(create_question_command_1.CreateQuestionCommand),
    __param(0, (0, common_1.Inject)('IQuestionRepository')),
    __metadata("design:paramtypes", [Object, event_bus_service_1.EventBusService])
], CreateQuestionHandler);
//# sourceMappingURL=create-question.handler.js.map
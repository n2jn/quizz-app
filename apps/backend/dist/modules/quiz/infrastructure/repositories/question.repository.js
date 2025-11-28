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
exports.QuestionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const question_aggregate_1 = require("../../domain/aggregates/question.aggregate");
const question_text_vo_1 = require("../../domain/value-objects/question-text.vo");
const explanation_vo_1 = require("../../domain/value-objects/explanation.vo");
const answer_entity_1 = require("../../domain/entities/answer.entity");
let QuestionRepository = class QuestionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(question) {
        await this.prisma.question.upsert({
            where: { id: question.id },
            create: {
                id: question.id,
                text: question.text.value,
                explanation: question.explanation.value,
                imageUrl: question.imageUrl,
                categoryId: question.categoryId,
                difficultyId: question.difficultyId,
                status: question.status,
                createdById: question.createdById,
                answers: {
                    create: question.answers.map((answer) => ({
                        id: answer.id,
                        text: answer.text,
                        isCorrect: answer.isCorrect,
                    })),
                },
            },
            update: {
                text: question.text.value,
                explanation: question.explanation.value,
                imageUrl: question.imageUrl,
                status: question.status,
                updatedAt: new Date(),
            },
        });
    }
    async findById(id) {
        const questionData = await this.prisma.question.findUnique({
            where: { id },
            include: { answers: true },
        });
        if (!questionData) {
            return null;
        }
        return this.toDomain(questionData);
    }
    async findByCategory(categoryId, status) {
        const questions = await this.prisma.question.findMany({
            where: {
                categoryId,
                ...(status && { status }),
            },
            include: { answers: true },
        });
        return questions.map((q) => this.toDomain(q));
    }
    async findByDifficulty(difficultyId, status) {
        const questions = await this.prisma.question.findMany({
            where: {
                difficultyId,
                ...(status && { status }),
            },
            include: { answers: true },
        });
        return questions.map((q) => this.toDomain(q));
    }
    async findRandomQuestions(difficultyId, categoryId, count) {
        const questions = await this.prisma.$queryRaw `
      SELECT q.*, json_agg(
        json_build_object(
          'id', a.id,
          'text', a.text,
          'isCorrect', a."isCorrect",
          'createdAt', a."createdAt",
          'updatedAt', a."updatedAt"
        )
      ) as answers
      FROM questions q
      LEFT JOIN answers a ON a."questionId" = q.id
      WHERE q."difficultyId" = ${difficultyId}
        AND q.status = 'PUBLISHED'
        ${categoryId ? `AND q."categoryId" = ${categoryId}` : ''}
      GROUP BY q.id
      ORDER BY RANDOM()
      LIMIT ${count}
    `;
        return questions.map((q) => this.toDomain(q));
    }
    async delete(id) {
        await this.prisma.question.delete({ where: { id } });
    }
    toDomain(data) {
        const answers = data.answers.map((a) => answer_entity_1.Answer.fromPersistence({
            id: a.id,
            text: a.text,
            isCorrect: a.isCorrect,
            createdAt: new Date(a.createdAt),
            updatedAt: new Date(a.updatedAt),
        }));
        return question_aggregate_1.Question.fromPersistence({
            id: data.id,
            text: question_text_vo_1.QuestionText.create(data.text),
            explanation: explanation_vo_1.Explanation.create(data.explanation),
            imageUrl: data.imageUrl,
            categoryId: data.categoryId,
            difficultyId: data.difficultyId,
            status: data.status,
            createdById: data.createdById,
            answers,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        });
    }
};
exports.QuestionRepository = QuestionRepository;
exports.QuestionRepository = QuestionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionRepository);
//# sourceMappingURL=question.repository.js.map
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
exports.QuizSessionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const quiz_session_aggregate_1 = require("../../domain/aggregates/quiz-session.aggregate");
let QuizSessionRepository = class QuizSessionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(session) {
        const existing = await this.prisma.quizSession.findUnique({
            where: { id: session.id },
        });
        if (existing) {
            await this.prisma.quizSession.update({
                where: { id: session.id },
                data: {
                    status: session.status,
                    score: session.score,
                    completedAt: session.completedAt,
                    updatedAt: new Date(),
                },
            });
            for (const answer of session.answers) {
                await this.prisma.sessionAnswer.upsert({
                    where: {
                        sessionId_questionId: {
                            sessionId: session.id,
                            questionId: answer.questionId,
                        },
                    },
                    create: {
                        id: `${session.id}-${answer.questionId}`,
                        sessionId: session.id,
                        questionId: answer.questionId,
                        answerId: answer.answerId,
                        isCorrect: answer.isCorrect,
                        timeSpent: answer.timeSpent,
                        pointsEarned: answer.pointsEarned,
                        timeBonus: answer.timeBonus,
                    },
                    update: {
                        isCorrect: answer.isCorrect,
                        timeSpent: answer.timeSpent,
                        pointsEarned: answer.pointsEarned,
                        timeBonus: answer.timeBonus,
                    },
                });
            }
        }
        else {
            await this.prisma.quizSession.create({
                data: {
                    id: session.id,
                    userId: session.userId,
                    categoryId: session.categoryId,
                    difficultyId: session.difficultyId,
                    status: session.status,
                    score: session.score,
                    startedAt: session.startedAt,
                    completedAt: session.completedAt,
                    expiresAt: session.expiresAt,
                },
            });
        }
    }
    async findById(id) {
        const sessionData = await this.prisma.quizSession.findUnique({
            where: { id },
            include: { answers: true },
        });
        if (!sessionData) {
            return null;
        }
        return this.toDomain(sessionData);
    }
    async findByUserId(userId, status) {
        const sessions = await this.prisma.quizSession.findMany({
            where: {
                userId,
                ...(status && { status }),
            },
            include: { answers: true },
            orderBy: { startedAt: 'desc' },
        });
        return sessions.map((s) => this.toDomain(s));
    }
    async findActiveByUserId(userId) {
        const sessionData = await this.prisma.quizSession.findFirst({
            where: {
                userId,
                status: quiz_session_aggregate_1.SessionStatus.IN_PROGRESS,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: { answers: true },
        });
        if (!sessionData) {
            return null;
        }
        return this.toDomain(sessionData);
    }
    async delete(id) {
        await this.prisma.quizSession.delete({ where: { id } });
    }
    toDomain(data) {
        const answers = (data.answers || []).map((a) => ({
            questionId: a.questionId,
            answerId: a.answerId,
            isCorrect: a.isCorrect,
            timeSpent: a.timeSpent,
            pointsEarned: a.pointsEarned,
            timeBonus: a.timeBonus,
        }));
        return quiz_session_aggregate_1.QuizSession.fromPersistence({
            id: data.id,
            userId: data.userId,
            categoryId: data.categoryId,
            difficultyId: data.difficultyId,
            status: data.status,
            score: data.score,
            answers,
            startedAt: new Date(data.startedAt),
            completedAt: data.completedAt ? new Date(data.completedAt) : null,
            expiresAt: new Date(data.expiresAt),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        });
    }
};
exports.QuizSessionRepository = QuizSessionRepository;
exports.QuizSessionRepository = QuizSessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizSessionRepository);
//# sourceMappingURL=quiz-session.repository.js.map
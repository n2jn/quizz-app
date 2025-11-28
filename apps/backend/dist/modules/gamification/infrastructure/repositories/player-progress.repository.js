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
exports.PlayerProgressRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const player_progress_aggregate_1 = require("../../domain/aggregates/player-progress.aggregate");
const uuid_1 = require("uuid");
let PlayerProgressRepository = class PlayerProgressRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(progress) {
        await this.prisma.playerProgress.upsert({
            where: { userId: progress.userId },
            create: {
                id: progress.id,
                userId: progress.userId,
                currentXP: progress.currentXP,
                currentLevel: progress.currentLevel,
                currentStreak: progress.currentStreak,
                longestStreak: progress.longestStreak,
                totalQuizzes: progress.totalQuizzes,
                perfectQuizzes: progress.perfectQuizzes,
                totalCorrect: progress.totalCorrect,
                totalAnswers: progress.totalAnswers,
            },
            update: {
                currentXP: progress.currentXP,
                currentLevel: progress.currentLevel,
                currentStreak: progress.currentStreak,
                longestStreak: progress.longestStreak,
                totalQuizzes: progress.totalQuizzes,
                perfectQuizzes: progress.perfectQuizzes,
                totalCorrect: progress.totalCorrect,
                totalAnswers: progress.totalAnswers,
                updatedAt: new Date(),
            },
        });
    }
    async findByUserId(userId) {
        const data = await this.prisma.playerProgress.findUnique({
            where: { userId },
        });
        if (!data)
            return null;
        return player_progress_aggregate_1.PlayerProgress.fromPersistence({
            id: data.id,
            userId: data.userId,
            currentXP: data.currentXP,
            currentLevel: data.currentLevel,
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
            totalQuizzes: data.totalQuizzes,
            perfectQuizzes: data.perfectQuizzes,
            totalCorrect: data.totalCorrect,
            totalAnswers: data.totalAnswers,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
    async getOrCreate(userId) {
        let progress = await this.findByUserId(userId);
        if (!progress) {
            progress = player_progress_aggregate_1.PlayerProgress.create((0, uuid_1.v4)(), userId);
            await this.save(progress);
        }
        return progress;
    }
};
exports.PlayerProgressRepository = PlayerProgressRepository;
exports.PlayerProgressRepository = PlayerProgressRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayerProgressRepository);
//# sourceMappingURL=player-progress.repository.js.map
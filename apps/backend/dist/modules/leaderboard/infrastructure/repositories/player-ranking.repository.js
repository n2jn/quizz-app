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
exports.PlayerRankingRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const player_ranking_aggregate_1 = require("../../domain/aggregates/player-ranking.aggregate");
const uuid_1 = require("uuid");
let PlayerRankingRepository = class PlayerRankingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(ranking) {
        await this.prisma.playerRanking.upsert({
            where: { userId: ranking.userId },
            create: {
                id: ranking.id,
                userId: ranking.userId,
                globalScore: ranking.globalScore,
                weeklyScore: ranking.weeklyScore,
                globalRank: ranking.globalRank,
                weeklyRank: ranking.weeklyRank,
            },
            update: {
                globalScore: ranking.globalScore,
                weeklyScore: ranking.weeklyScore,
                globalRank: ranking.globalRank,
                weeklyRank: ranking.weeklyRank,
                updatedAt: new Date(),
            },
        });
    }
    async findByUserId(userId) {
        const data = await this.prisma.playerRanking.findUnique({
            where: { userId },
        });
        if (!data)
            return null;
        return player_ranking_aggregate_1.PlayerRanking.fromPersistence({
            id: data.id,
            userId: data.userId,
            globalScore: data.globalScore,
            weeklyScore: data.weeklyScore,
            globalRank: data.globalRank,
            weeklyRank: data.weeklyRank,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
    async getOrCreate(userId) {
        let ranking = await this.findByUserId(userId);
        if (!ranking) {
            ranking = player_ranking_aggregate_1.PlayerRanking.create((0, uuid_1.v4)(), userId);
            await this.save(ranking);
        }
        return ranking;
    }
    async getTopGlobal(limit) {
        const data = await this.prisma.playerRanking.findMany({
            orderBy: { globalScore: 'desc' },
            take: limit,
        });
        return data.map((d) => player_ranking_aggregate_1.PlayerRanking.fromPersistence({
            id: d.id,
            userId: d.userId,
            globalScore: d.globalScore,
            weeklyScore: d.weeklyScore,
            globalRank: d.globalRank,
            weeklyRank: d.weeklyRank,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
        }));
    }
    async getTopWeekly(limit) {
        const data = await this.prisma.playerRanking.findMany({
            orderBy: { weeklyScore: 'desc' },
            take: limit,
        });
        return data.map((d) => player_ranking_aggregate_1.PlayerRanking.fromPersistence({
            id: d.id,
            userId: d.userId,
            globalScore: d.globalScore,
            weeklyScore: d.weeklyScore,
            globalRank: d.globalRank,
            weeklyRank: d.weeklyRank,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
        }));
    }
};
exports.PlayerRankingRepository = PlayerRankingRepository;
exports.PlayerRankingRepository = PlayerRankingRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayerRankingRepository);
//# sourceMappingURL=player-ranking.repository.js.map
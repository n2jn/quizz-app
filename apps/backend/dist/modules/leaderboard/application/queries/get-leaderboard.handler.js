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
exports.GetLeaderboardHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const get_leaderboard_query_1 = require("./get-leaderboard.query");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
let GetLeaderboardHandler = class GetLeaderboardHandler {
    constructor(rankingRepository, prisma) {
        this.rankingRepository = rankingRepository;
        this.prisma = prisma;
    }
    async execute(query) {
        const rankings = query.type === 'global'
            ? await this.rankingRepository.getTopGlobal(query.limit)
            : await this.rankingRepository.getTopWeekly(query.limit);
        const userIds = rankings.map((r) => r.userId);
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true },
        });
        const userMap = new Map(users.map((u) => [u.id, u.username]));
        return rankings.map((ranking) => ({
            userId: ranking.userId,
            username: userMap.get(ranking.userId) || 'Unknown',
            score: query.type === 'global' ? ranking.globalScore : ranking.weeklyScore,
            rank: query.type === 'global' ? ranking.globalRank : ranking.weeklyRank,
        }));
    }
};
exports.GetLeaderboardHandler = GetLeaderboardHandler;
exports.GetLeaderboardHandler = GetLeaderboardHandler = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.QueryHandler)(get_leaderboard_query_1.GetLeaderboardQuery),
    __param(0, (0, common_1.Inject)('IPlayerRankingRepository')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], GetLeaderboardHandler);
//# sourceMappingURL=get-leaderboard.handler.js.map
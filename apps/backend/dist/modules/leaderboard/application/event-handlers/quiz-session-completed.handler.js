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
var QuizSessionCompletedLeaderboardHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionCompletedLeaderboardHandler = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let QuizSessionCompletedLeaderboardHandler = QuizSessionCompletedLeaderboardHandler_1 = class QuizSessionCompletedLeaderboardHandler {
    constructor(rankingRepository) {
        this.rankingRepository = rankingRepository;
        this.logger = new common_1.Logger(QuizSessionCompletedLeaderboardHandler_1.name);
    }
    async handle(event) {
        const { userId, totalPoints } = event.props;
        this.logger.log(`Updating leaderboard score for user: ${userId} (+${totalPoints} points)`);
        try {
            const ranking = await this.rankingRepository.getOrCreate(userId);
            ranking.addScore(totalPoints);
            await this.rankingRepository.save(ranking);
            this.logger.log(`Leaderboard updated for user ${userId}: Global ${ranking.globalScore}, Weekly ${ranking.weeklyScore}`);
        }
        catch (error) {
            this.logger.error(`Failed to update leaderboard for user: ${userId}`, error);
            throw error;
        }
    }
};
exports.QuizSessionCompletedLeaderboardHandler = QuizSessionCompletedLeaderboardHandler;
__decorate([
    (0, event_emitter_1.OnEvent)('quiz.session.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizSessionCompletedLeaderboardHandler.prototype, "handle", null);
exports.QuizSessionCompletedLeaderboardHandler = QuizSessionCompletedLeaderboardHandler = QuizSessionCompletedLeaderboardHandler_1 = __decorate([
    __param(0, (0, common_1.Inject)('IPlayerRankingRepository')),
    __metadata("design:paramtypes", [Object])
], QuizSessionCompletedLeaderboardHandler);
//# sourceMappingURL=quiz-session-completed.handler.js.map
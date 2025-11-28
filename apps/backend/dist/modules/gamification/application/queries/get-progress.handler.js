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
exports.GetProgressHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const get_progress_query_1 = require("./get-progress.query");
let GetProgressHandler = class GetProgressHandler {
    constructor(progressRepository) {
        this.progressRepository = progressRepository;
    }
    async execute(query) {
        const progress = await this.progressRepository.getOrCreate(query.userId);
        return {
            currentXP: progress.currentXP,
            currentLevel: progress.currentLevel,
            currentStreak: progress.currentStreak,
            longestStreak: progress.longestStreak,
            totalQuizzes: progress.totalQuizzes,
            perfectQuizzes: progress.perfectQuizzes,
            accuracy: progress.accuracy,
        };
    }
};
exports.GetProgressHandler = GetProgressHandler;
exports.GetProgressHandler = GetProgressHandler = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.QueryHandler)(get_progress_query_1.GetProgressQuery),
    __param(0, (0, common_1.Inject)('IPlayerProgressRepository')),
    __metadata("design:paramtypes", [Object])
], GetProgressHandler);
//# sourceMappingURL=get-progress.handler.js.map
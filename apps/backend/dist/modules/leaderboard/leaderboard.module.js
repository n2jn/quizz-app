"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_module_1 = require("../../shared/shared.module");
const leaderboard_controller_1 = require("./presentation/controllers/leaderboard.controller");
const get_leaderboard_handler_1 = require("./application/queries/get-leaderboard.handler");
const player_ranking_repository_1 = require("./infrastructure/repositories/player-ranking.repository");
const user_registered_handler_1 = require("./application/event-handlers/user-registered.handler");
const quiz_session_completed_handler_1 = require("./application/event-handlers/quiz-session-completed.handler");
const QueryHandlers = [get_leaderboard_handler_1.GetLeaderboardHandler];
const EventHandlers = [
    user_registered_handler_1.UserRegisteredLeaderboardHandler,
    quiz_session_completed_handler_1.QuizSessionCompletedLeaderboardHandler,
];
const Repositories = [
    {
        provide: 'IPlayerRankingRepository',
        useClass: player_ranking_repository_1.PlayerRankingRepository,
    },
];
let LeaderboardModule = class LeaderboardModule {
};
exports.LeaderboardModule = LeaderboardModule;
exports.LeaderboardModule = LeaderboardModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, shared_module_1.SharedModule],
        controllers: [leaderboard_controller_1.LeaderboardController],
        providers: [...QueryHandlers, ...EventHandlers, ...Repositories],
        exports: [],
    })
], LeaderboardModule);
//# sourceMappingURL=leaderboard.module.js.map
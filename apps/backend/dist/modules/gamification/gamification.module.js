"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_module_1 = require("../../shared/shared.module");
const gamification_controller_1 = require("./presentation/controllers/gamification.controller");
const get_progress_handler_1 = require("./application/queries/get-progress.handler");
const player_progress_repository_1 = require("./infrastructure/repositories/player-progress.repository");
const user_registered_handler_1 = require("./application/event-handlers/user-registered.handler");
const quiz_session_completed_handler_1 = require("./application/event-handlers/quiz-session-completed.handler");
const QueryHandlers = [get_progress_handler_1.GetProgressHandler];
const EventHandlers = [
    user_registered_handler_1.UserRegisteredGamificationHandler,
    quiz_session_completed_handler_1.QuizSessionCompletedGamificationHandler,
];
const Repositories = [
    {
        provide: 'IPlayerProgressRepository',
        useClass: player_progress_repository_1.PlayerProgressRepository,
    },
];
let GamificationModule = class GamificationModule {
};
exports.GamificationModule = GamificationModule;
exports.GamificationModule = GamificationModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, shared_module_1.SharedModule],
        controllers: [gamification_controller_1.GamificationController],
        providers: [...QueryHandlers, ...EventHandlers, ...Repositories],
        exports: [],
    })
], GamificationModule);
//# sourceMappingURL=gamification.module.js.map
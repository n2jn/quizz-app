"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EconomyModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_module_1 = require("../../shared/shared.module");
const economy_controller_1 = require("./presentation/controllers/economy.controller");
const purchase_item_handler_1 = require("./application/commands/purchase-item.handler");
const get_wallet_handler_1 = require("./application/queries/get-wallet.handler");
const get_lives_handler_1 = require("./application/queries/get-lives.handler");
const wallet_repository_1 = require("./infrastructure/repositories/wallet.repository");
const lives_repository_1 = require("./infrastructure/repositories/lives.repository");
const user_registered_handler_1 = require("./application/event-handlers/user-registered.handler");
const quiz_session_completed_handler_1 = require("./application/event-handlers/quiz-session-completed.handler");
const quiz_session_started_handler_1 = require("./application/event-handlers/quiz-session-started.handler");
const level_up_handler_1 = require("./application/event-handlers/level-up.handler");
const CommandHandlers = [purchase_item_handler_1.PurchaseItemHandler];
const QueryHandlers = [get_wallet_handler_1.GetWalletHandler, get_lives_handler_1.GetLivesHandler];
const EventHandlers = [
    user_registered_handler_1.UserRegisteredEconomyHandler,
    quiz_session_completed_handler_1.QuizSessionCompletedEconomyHandler,
    quiz_session_started_handler_1.QuizSessionStartedEconomyHandler,
    level_up_handler_1.LevelUpEconomyHandler,
];
const Repositories = [
    {
        provide: 'IWalletRepository',
        useClass: wallet_repository_1.WalletRepository,
    },
    {
        provide: 'ILivesRepository',
        useClass: lives_repository_1.LivesRepository,
    },
];
let EconomyModule = class EconomyModule {
};
exports.EconomyModule = EconomyModule;
exports.EconomyModule = EconomyModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, shared_module_1.SharedModule],
        controllers: [economy_controller_1.EconomyController],
        providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers, ...Repositories],
        exports: [],
    })
], EconomyModule);
//# sourceMappingURL=economy.module.js.map
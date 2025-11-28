"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const throttler_1 = require("@nestjs/throttler");
const shared_module_1 = require("./shared/shared.module");
const identity_module_1 = require("./modules/identity/identity.module");
const quiz_module_1 = require("./modules/quiz/quiz.module");
const economy_module_1 = require("./modules/economy/economy.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const leaderboard_module_1 = require("./modules/leaderboard/leaderboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                cache: true,
            }),
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: false,
                delimiter: '.',
                newListener: false,
                removeListener: false,
                maxListeners: 10,
                verboseMemoryLeak: true,
                ignoreErrors: false,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            shared_module_1.SharedModule,
            identity_module_1.IdentityModule,
            quiz_module_1.QuizModule,
            economy_module_1.EconomyModule,
            gamification_module_1.GamificationModule,
            leaderboard_module_1.LeaderboardModule,
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
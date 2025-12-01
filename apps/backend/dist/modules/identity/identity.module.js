"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const register_user_handler_1 = require("./application/commands/register-user.handler");
const login_user_handler_1 = require("./application/commands/login-user.handler");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
const password_service_1 = require("./infrastructure/services/password.service");
const jwt_service_1 = require("./infrastructure/services/jwt.service");
const jwt_strategy_1 = require("./infrastructure/strategies/jwt.strategy");
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const CommandHandlers = [register_user_handler_1.RegisterUserHandler, login_user_handler_1.LoginUserHandler];
const Repositories = [
    {
        provide: 'IUserRepository',
        useClass: user_repository_1.UserRepository,
    },
];
const Services = [password_service_1.PasswordService, jwt_service_1.JwtTokenService];
const Strategies = [jwt_strategy_1.JwtStrategy];
let IdentityModule = class IdentityModule {
};
exports.IdentityModule = IdentityModule;
exports.IdentityModule = IdentityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [...CommandHandlers, ...Repositories, ...Services, ...Strategies],
        exports: [jwt_1.JwtModule, passport_1.PassportModule, ...Services],
    })
], IdentityModule);
//# sourceMappingURL=identity.module.js.map
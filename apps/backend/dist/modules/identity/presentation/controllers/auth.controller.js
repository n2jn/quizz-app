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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const register_dto_1 = require("../dtos/register.dto");
const login_dto_1 = require("../dtos/login.dto");
const auth_response_dto_1 = require("../dtos/auth-response.dto");
const register_user_command_1 = require("../../application/commands/register-user.command");
const login_user_command_1 = require("../../application/commands/login-user.command");
const password_service_1 = require("../../infrastructure/services/password.service");
const jwt_service_1 = require("../../infrastructure/services/jwt.service");
const email_vo_1 = require("../../domain/value-objects/email.vo");
let AuthController = class AuthController {
    constructor(commandBus, passwordService, jwtTokenService, userRepository) {
        this.commandBus = commandBus;
        this.passwordService = passwordService;
        this.jwtTokenService = jwtTokenService;
        this.userRepository = userRepository;
    }
    async register(dto) {
        const hashedPassword = await this.passwordService.hash(dto.password);
        const result = await this.commandBus.execute(new register_user_command_1.RegisterUserCommand(dto.email, dto.username, dto.username, hashedPassword));
        const tokens = await this.jwtTokenService.generateTokenPair(result.userId, result.email, result.username, 'PLAYER');
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                userId: result.userId,
                email: result.email,
                username: result.username,
                role: 'PLAYER',
            },
        };
    }
    async login(dto) {
        const email = email_vo_1.Email.create(dto.email);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.passwordService.compare(dto.password, user.getPasswordHash());
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const result = await this.commandBus.execute(new login_user_command_1.LoginUserCommand(dto.email, dto.password));
        const tokens = await this.jwtTokenService.generateTokenPair(result.userId, result.email, result.username, result.role);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                userId: result.userId,
                email: result.email,
                username: result.username,
                role: result.role,
            },
        };
    }
    async refresh(dto) {
        const tokens = await this.jwtTokenService.refreshAccessToken(dto.refreshToken);
        if (!tokens) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = await this.userRepository.findById(this.jwtTokenService['jwtService'].decode(tokens.accessToken)['sub']);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                userId: user.id,
                email: user.getEmail().value,
                username: user.getUsername().value,
                role: user.getRole(),
            },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: auth_response_dto_1.AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_dto_1.AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_dto_1.AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_response_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __param(3, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        password_service_1.PasswordService,
        jwt_service_1.JwtTokenService, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
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
exports.JwtTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const uuid_1 = require("uuid");
let JwtTokenService = class JwtTokenService {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async generateTokenPair(userId, email, username, role) {
        const payload = {
            sub: userId,
            email,
            username,
            role,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        });
        const refreshToken = await this.generateRefreshToken(userId);
        return {
            accessToken,
            refreshToken,
        };
    }
    async generateRefreshToken(userId) {
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
        return token;
    }
    async refreshAccessToken(refreshToken) {
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            return null;
        }
        await this.prisma.refreshToken.delete({
            where: { token: refreshToken },
        });
        return this.generateTokenPair(storedToken.user.id, storedToken.user.email, storedToken.user.username, storedToken.user.role);
    }
    async revokeRefreshToken(token) {
        await this.prisma.refreshToken.deleteMany({
            where: { token },
        });
    }
    async revokeAllUserTokens(userId) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
};
exports.JwtTokenService = JwtTokenService;
exports.JwtTokenService = JwtTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], JwtTokenService);
//# sourceMappingURL=jwt.service.js.map
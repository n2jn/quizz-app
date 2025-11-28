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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../shared/infrastructure/database/prisma.service");
const user_aggregate_1 = require("../../domain/aggregates/user.aggregate");
const email_vo_1 = require("../../domain/value-objects/email.vo");
const username_vo_1 = require("../../domain/value-objects/username.vo");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const userModel = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!userModel) {
            return null;
        }
        return this.toDomain(userModel);
    }
    async findByEmail(email) {
        const userModel = await this.prisma.user.findUnique({
            where: { email: email.value },
        });
        if (!userModel) {
            return null;
        }
        return this.toDomain(userModel);
    }
    async findByUsername(username) {
        const userModel = await this.prisma.user.findUnique({
            where: { username: username.value },
        });
        if (!userModel) {
            return null;
        }
        return this.toDomain(userModel);
    }
    async exists(email, username) {
        const count = await this.prisma.user.count({
            where: {
                OR: [{ email: email.value }, { username: username.value }],
            },
        });
        return count > 0;
    }
    async save(user) {
        await this.prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                email: user.getEmail().value,
                username: user.getUsername().value,
                password: user.getPasswordHash(),
                role: user.getRole(),
                createdAt: user.getCreatedAt(),
                updatedAt: user.getUpdatedAt(),
            },
            update: {
                email: user.getEmail().value,
                username: user.getUsername().value,
                password: user.getPasswordHash(),
                role: user.getRole(),
                updatedAt: user.getUpdatedAt(),
            },
        });
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
    toDomain(userModel) {
        return user_aggregate_1.User.fromPersistence({
            id: userModel.id,
            email: email_vo_1.Email.create(userModel.email),
            username: username_vo_1.Username.create(userModel.username),
            passwordHash: userModel.password,
            role: userModel.role,
            createdAt: userModel.createdAt,
            updatedAt: userModel.updatedAt,
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map
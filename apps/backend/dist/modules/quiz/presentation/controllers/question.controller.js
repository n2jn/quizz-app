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
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../shared/presentation/guards/jwt-auth.guard");
const roles_decorator_1 = require("../../../../shared/presentation/decorators/roles.decorator");
const roles_guard_1 = require("../../../../shared/presentation/guards/roles.guard");
const current_user_decorator_1 = require("../../../../shared/presentation/decorators/current-user.decorator");
const dtos_1 = require("../dtos");
const create_question_command_1 = require("../../application/commands/create-question.command");
let QuestionController = class QuestionController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async createQuestion(user, dto) {
        const result = await this.commandBus.execute(new create_question_command_1.CreateQuestionCommand(dto.text, dto.explanation, dto.categoryId, dto.difficultyId, user.userId, dto.answers, dto.imageUrl));
        return result;
    }
};
exports.QuestionController = QuestionController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new question (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
        type: dtos_1.CreateQuestionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid question data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin access required' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "createQuestion", null);
exports.QuestionController = QuestionController = __decorate([
    (0, swagger_1.ApiTags)('questions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], QuestionController);
//# sourceMappingURL=question.controller.js.map
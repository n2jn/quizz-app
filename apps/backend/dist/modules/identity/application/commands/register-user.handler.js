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
exports.RegisterUserHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const register_user_command_1 = require("./register-user.command");
const email_vo_1 = require("../../domain/value-objects/email.vo");
const username_vo_1 = require("../../domain/value-objects/username.vo");
const user_aggregate_1 = require("../../domain/aggregates/user.aggregate");
const event_bus_service_1 = require("../../../../shared/infrastructure/events/event-bus.service");
const exceptions_1 = require("../../../../shared/domain/exceptions");
const uuid_1 = require("uuid");
let RegisterUserHandler = class RegisterUserHandler {
    constructor(userRepository, eventBus) {
        this.userRepository = userRepository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const email = email_vo_1.Email.create(command.email);
        const username = username_vo_1.Username.create(command.username);
        const exists = await this.userRepository.exists(email, username);
        if (exists) {
            throw new exceptions_1.EntityAlreadyExistsException('User', command.email);
        }
        const userId = (0, uuid_1.v4)();
        const user = user_aggregate_1.User.create(userId, email, username, command.password);
        await this.userRepository.save(user);
        await this.eventBus.publishAll([...user.domainEvents]);
        user.clearEvents();
        return {
            userId: user.id,
            email: email.value,
            username: username.value,
        };
    }
};
exports.RegisterUserHandler = RegisterUserHandler;
exports.RegisterUserHandler = RegisterUserHandler = __decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.CommandHandler)(register_user_command_1.RegisterUserCommand),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, event_bus_service_1.EventBusService])
], RegisterUserHandler);
//# sourceMappingURL=register-user.handler.js.map
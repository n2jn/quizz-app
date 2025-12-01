"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const base_1 = require("../../../../shared/domain/base");
const user_registered_event_1 = require("../events/user-registered.event");
exports.UserRole = {
    PLAYER: 'PLAYER',
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
};
class User extends base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.email = props.email;
        this.username = props.username;
        this.name = props.name;
        this.passwordHash = props.passwordHash;
        this.role = props.role;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    static create(id, email, username, name, passwordHash) {
        const user = new User({
            id,
            email,
            username,
            name,
            passwordHash,
            role: exports.UserRole.PLAYER,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        user.addDomainEvent(new user_registered_event_1.UserRegisteredEvent({
            userId: id,
            email: email.value,
            username: username.value,
        }));
        return user;
    }
    static fromPersistence(props) {
        return new User(props);
    }
    getEmail() {
        return this.email;
    }
    getUsername() {
        return this.username;
    }
    getName() {
        return this.name;
    }
    getPasswordHash() {
        return this.passwordHash;
    }
    getRole() {
        return this.role;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    isAdmin() {
        return this.role === exports.UserRole.ADMIN || this.role === exports.UserRole.SUPER_ADMIN;
    }
    isSuperAdmin() {
        return this.role === exports.UserRole.SUPER_ADMIN;
    }
    updatePassword(newPasswordHash) {
        this.passwordHash = newPasswordHash;
        this.updatedAt = new Date();
    }
}
exports.User = User;
//# sourceMappingURL=user.aggregate.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const base_1 = require("../../../../shared/domain/base");
const user_registered_event_1 = require("../events/user-registered.event");
var UserRole;
(function (UserRole) {
    UserRole["PLAYER"] = "PLAYER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
class User extends base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.email = props.email;
        this.username = props.username;
        this.passwordHash = props.passwordHash;
        this.role = props.role;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    static create(id, email, username, passwordHash) {
        const user = new User({
            id,
            email,
            username,
            passwordHash,
            role: UserRole.PLAYER,
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
        return this.role === UserRole.ADMIN || this.role === UserRole.SUPER_ADMIN;
    }
    isSuperAdmin() {
        return this.role === UserRole.SUPER_ADMIN;
    }
    updatePassword(newPasswordHash) {
        this.passwordHash = newPasswordHash;
        this.updatedAt = new Date();
    }
}
exports.User = User;
//# sourceMappingURL=user.aggregate.js.map
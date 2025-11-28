"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Username = void 0;
const base_1 = require("../../../../shared/domain/base");
const exceptions_1 = require("../../../../shared/domain/exceptions");
class Username extends base_1.ValueObject {
    constructor(props) {
        super(props);
    }
    static create(username) {
        if (!username || username.trim().length === 0) {
            throw new exceptions_1.DomainException('Username cannot be empty');
        }
        const trimmedUsername = username.trim();
        if (trimmedUsername.length < this.MIN_LENGTH) {
            throw new exceptions_1.DomainException(`Username must be at least ${this.MIN_LENGTH} characters`);
        }
        if (trimmedUsername.length > this.MAX_LENGTH) {
            throw new exceptions_1.DomainException(`Username cannot exceed ${this.MAX_LENGTH} characters`);
        }
        if (!this.USERNAME_REGEX.test(trimmedUsername)) {
            throw new exceptions_1.DomainException('Username can only contain letters, numbers, and underscores');
        }
        return new Username({ value: trimmedUsername });
    }
    get value() {
        return this.props.value;
    }
}
exports.Username = Username;
Username.MIN_LENGTH = 3;
Username.MAX_LENGTH = 20;
Username.USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
//# sourceMappingURL=username.vo.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const base_1 = require("../../../../shared/domain/base");
const exceptions_1 = require("../../../../shared/domain/exceptions");
class Email extends base_1.ValueObject {
    constructor(props) {
        super(props);
    }
    static create(email) {
        if (!email || email.trim().length === 0) {
            throw new exceptions_1.DomainException('Email cannot be empty');
        }
        const normalizedEmail = email.toLowerCase().trim();
        if (!this.EMAIL_REGEX.test(normalizedEmail)) {
            throw new exceptions_1.DomainException('Invalid email format');
        }
        return new Email({ value: normalizedEmail });
    }
    get value() {
        return this.props.value;
    }
}
exports.Email = Email;
Email.EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//# sourceMappingURL=email.vo.js.map
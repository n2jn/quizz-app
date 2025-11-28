"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidArgumentException = exports.InvalidOperationException = exports.EntityAlreadyExistsException = exports.BusinessRuleViolationException = exports.EntityNotFoundException = exports.DomainException = void 0;
class DomainException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainException = DomainException;
class EntityNotFoundException extends DomainException {
    constructor(entityName, id) {
        super(`${entityName} with id "${id}" not found`);
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class BusinessRuleViolationException extends DomainException {
    constructor(rule) {
        super(`Business rule violation: ${rule}`);
    }
}
exports.BusinessRuleViolationException = BusinessRuleViolationException;
class EntityAlreadyExistsException extends DomainException {
    constructor(entityName, identifier) {
        super(`${entityName} with identifier "${identifier}" already exists`);
    }
}
exports.EntityAlreadyExistsException = EntityAlreadyExistsException;
class InvalidOperationException extends DomainException {
    constructor(operation, reason) {
        super(`Invalid operation "${operation}": ${reason}`);
    }
}
exports.InvalidOperationException = InvalidOperationException;
class InvalidArgumentException extends DomainException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidArgumentException = InvalidArgumentException;
//# sourceMappingURL=domain.exception.js.map
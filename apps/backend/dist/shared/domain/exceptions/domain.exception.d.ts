export declare class DomainException extends Error {
    constructor(message: string);
}
export declare class EntityNotFoundException extends DomainException {
    constructor(entityName: string, id: string);
}
export declare class BusinessRuleViolationException extends DomainException {
    constructor(rule: string);
}
export declare class EntityAlreadyExistsException extends DomainException {
    constructor(entityName: string, identifier: string);
}
export declare class InvalidOperationException extends DomainException {
    constructor(operation: string, reason: string);
}
export declare class InvalidArgumentException extends DomainException {
    constructor(message: string);
}

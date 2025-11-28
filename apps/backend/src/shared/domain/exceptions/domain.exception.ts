/**
 * Base Domain Exception
 *
 * All domain-specific exceptions should extend this class.
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when an entity is not found
 */
export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id "${id}" not found`);
  }
}

/**
 * Thrown when a business rule is violated
 */
export class BusinessRuleViolationException extends DomainException {
  constructor(rule: string) {
    super(`Business rule violation: ${rule}`);
  }
}

/**
 * Thrown when an entity already exists
 */
export class EntityAlreadyExistsException extends DomainException {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} with identifier "${identifier}" already exists`);
  }
}

/**
 * Thrown when an invalid operation is attempted
 */
export class InvalidOperationException extends DomainException {
  constructor(operation: string, reason: string) {
    super(`Invalid operation "${operation}": ${reason}`);
  }
}

/**
 * Thrown when an invalid argument is provided
 */
export class InvalidArgumentException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

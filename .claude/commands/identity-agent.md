# Identity Agent - Identity Context

You are the Identity Agent responsible for the Identity bounded context (tickets #006-#012).

## Your Mission

Implement user identity and authentication for PastryQuiz:
- User domain model (aggregate, value objects)
- User repository with Prisma
- Registration, login, token refresh commands
- Authentication controllers and DTOs
- JWT token management
- Email uniqueness validation

## Primary References

**Read these first:**
- `docs/architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md` - JWT config, validation rules
- `docs/architecture/02-Bounded-Contexts/contexts/identity.md` - Domain model
- `docs/architecture/03-Technical-Architecture/application-architecture.md` - CQRS patterns
- `docs/architecture/03-Technical-Architecture/validation-and-security.md` - Security requirements

## Your Tickets (Phase 2 - Identity)

1. **#006** - User Domain (Aggregate, Value Objects)
2. **#007** - User Repository
3. **#008** - Register Command & Handler
4. **#009** - Login Command & Handler
5. **#010** - Refresh Token Handler
6. **#011** - Auth Controller & DTOs
7. **#012** - Identity Context Tests

## Domain Model

### User Aggregate
```typescript
class User {
  id: UserId
  email: Email           // Value Object
  passwordHash: string
  username: Username     // Value Object
  createdAt: Date
  updatedAt: Date
}
```

### Value Objects
- `Email` - Validates email format
- `Username` - 3-20 chars, alphanumeric + underscore
- `UserId` - UUID wrapper

### Domain Events
- `UserRegisteredEvent` - Emit after successful registration
- `UserLoggedInEvent` - Emit after successful login (optional)

## Key Specifications

### Password Requirements (IMPLEMENTATION-SPECS.md)
```typescript
PASSWORD_MIN_LENGTH = 8
PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false  // Optional for MVP
}
```

### JWT Configuration
```typescript
JWT_ACCESS_EXPIRES = '15m'
JWT_REFRESH_EXPIRES = '7d'
BCRYPT_SALT_ROUNDS = 12
```

### Validation Rules
- Email must be unique
- Username must be unique
- Email must match RFC 5322 format
- Password must be hashed with bcrypt (salt rounds: 12)

## Implementation Pattern

### Command Structure
```typescript
// Example: RegisterUserCommand
export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
  ) {}
}

// Handler
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler {
  async execute(command: RegisterUserCommand): Promise<UserRegisteredDto> {
    // 1. Validate email uniqueness
    // 2. Create User aggregate
    // 3. Hash password
    // 4. Save via repository
    // 5. Emit UserRegisteredEvent
    // 6. Return DTO
  }
}
```

### Repository Pattern
```typescript
export interface IUserRepository {
  save(user: User): Promise<void>
  findByEmail(email: Email): Promise<User | null>
  findById(id: UserId): Promise<User | null>
  findByUsername(username: Username): Promise<User | null>
}
```

## Quality Standards

- **Domain Layer**: Pure TypeScript, no framework dependencies
- **Tests**: >90% coverage for domain logic
- **Validation**: Use class-validator in DTOs
- **Security**: Never expose password hashes in responses
- **Events**: Emit domain events for cross-context communication

## Dependencies

**Requires Phase 1 complete:**
- Shared infrastructure (#004)
- Authentication infrastructure (#005)
- Prisma schema with User table (#002)

## Integration Points

**Emits events consumed by:**
- Gamification Context - Creates PlayerProgress on UserRegisteredEvent
- Economy Context - Creates Wallet on UserRegisteredEvent

## Workflow

1. **Start with #006** - Build domain model first
2. **Then #007** - Implement repository
3. **Commands #008-#010** - Build use cases
4. **Controller #011** - Expose HTTP endpoints
5. **Tests #012** - Comprehensive testing

## Testing Checklist

- [ ] User aggregate business logic
- [ ] Value object validation (Email, Username)
- [ ] Repository operations
- [ ] Command handlers (register, login, refresh)
- [ ] Email uniqueness validation
- [ ] Password hashing
- [ ] JWT token generation
- [ ] Domain event emission
- [ ] Controller endpoints (e2e)

**Ready to implement?** Ask the user which ticket to start with, or begin with #006.

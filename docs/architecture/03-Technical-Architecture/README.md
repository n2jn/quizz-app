# 📁 Technical Architecture Documentation

This folder contains all technical implementation specifications for the PastryQuiz backend.

---

## 🤖 For AI Agents: Start Here

**→ [`IMPLEMENTATION-SPECS.md`](./IMPLEMENTATION-SPECS.md)** - Condensed reference for code generation (all formulas, rules, signatures)

This is your primary reference. Zero prose, pure specs. Everything you need in 2000 lines.

---

## 📚 Document Index

### Agent-Optimized

| Document | Purpose | Status |
|----------|---------|--------|
| **IMPLEMENTATION-SPECS.md** | 🎯 Condensed specs: formulas, rules, signatures, constants (FOR AGENTS) | ✅ Complete |

### Core Architecture (Human Reference)

| Document | Purpose | Status |
|----------|---------|--------|
| **application-architecture.md** | NestJS folder structure, Clean Architecture layers, module organization | ✅ Complete |
| **prisma-schema.md** | Database schema overview, models, relationships | ✅ Complete |
| **prisma-schema.txt** | Actual Prisma schema file | ✅ Complete |
| **api-design.md** | All API endpoints, request/response formats, error codes | ✅ Complete |

### Business Rules & Logic

| Document | Purpose | Status |
|----------|---------|--------|
| **business-rules-implementation.md** | How business rules map to code, formulas, calculations | ✅ Complete |
| **event-architecture.md** | Domain events, event handlers, cross-context communication | ✅ Complete |
| **validation-and-security.md** | Input validation, authorization, anti-cheat, security | ✅ Complete |

### Infrastructure & Operations

| Document | Purpose | Status |
|----------|---------|--------|
| **background-jobs.md** | Cron jobs, schedules, async tasks | ✅ Complete |
| **seed-instructions.md** | Database seeding strategy | ✅ Complete |

---

## 🎯 How to Use This Documentation

### For Backend Developers

**Before starting implementation:**

1. Read **application-architecture.md** to understand the folder structure and module organization
2. Review **prisma-schema.md** to understand the data model
3. Check **api-design.md** for the endpoint you're implementing
4. Reference **business-rules-implementation.md** for specific calculation formulas
5. Check **validation-and-security.md** for validation requirements

**While implementing:**

- Use **event-architecture.md** when adding event handlers
- Reference **background-jobs.md** when working on cron jobs
- Follow patterns from **application-architecture.md** (aggregates, repositories, handlers)

### For Claude Agents

When asking a Claude agent to build a feature:

**Minimal context (recommended):**
```
I need you to implement [feature name].

Read: architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md
Follow: Clean Architecture + DDD patterns from application-architecture.md

The spec has all formulas, validation rules, and event signatures.
```

**For complex features:**
```
Implement the "Start Quiz" feature.

Primary reference: IMPLEMENTATION-SPECS.md
Architecture patterns: application-architecture.md

Include:
- StartQuizCommand and handler
- QuizSession aggregate
- API endpoint in QuizController
- Event handlers (see IMPLEMENTATION-SPECS.md event map)
```

**Why IMPLEMENTATION-SPECS.md?**
- 70% smaller than full docs
- Zero prose, only specifications
- All formulas, constants, signatures in one place
- Faster parsing, less token usage

---

## 🏗️ Architecture Decisions

### Key Patterns Used

**Domain-Driven Design (DDD)**
- Aggregates: QuizSession, PlayerProgress, Wallet, Lives
- Value Objects: Score, Difficulty, Experience, Streak
- Domain Events: QuizCompleted, LevelUp, BadgeUnlocked
- Repositories: Abstract interfaces in domain, implementations in infrastructure

**Clean Architecture**
- 4 layers: Domain → Application → Infrastructure → Presentation
- Dependency rule: Inner layers don't depend on outer layers
- Domain layer is pure TypeScript (no framework dependencies)

**CQRS (Command Query Responsibility Segregation)**
- Commands: StartQuiz, SubmitAnswer, PurchaseItem
- Queries: GetQuizResult, GetLeaderboard, GetPlayerProgress
- Separate handlers for commands and queries

**Event-Driven Architecture**
- In-process events using NestJS EventEmitter
- Asynchronous communication between bounded contexts
- Event sourcing optional (DomainEvent table for audit)

---

## 🔗 Cross-References

### Quiz Flow

1. User starts quiz → **api-design.md** (POST /api/v1/quiz/start)
2. Validation → **validation-and-security.md** (Start Quiz Validation)
3. Domain logic → **application-architecture.md** (QuizSession.start())
4. Business rules → **business-rules-implementation.md** (Quiz Session Rules)
5. Events → **event-architecture.md** (QuizStartedEvent)
6. Life consumption → **event-architecture.md** (QuizStartedHandler in Economy)

### Gamification Flow

1. Quiz completed → **event-architecture.md** (QuizCompletedEvent)
2. XP calculation → **business-rules-implementation.md** (XP Calculation with Streak Bonus)
3. Level up check → **business-rules-implementation.md** (Level Formula)
4. Badge evaluation → **background-jobs.md** (Badge Evaluation)
5. Coin rewards → **business-rules-implementation.md** (Coin Rewards)

### Cron Jobs

1. Life regen → **background-jobs.md** (Life Regeneration Job)
2. Streak update → **background-jobs.md** (Streak Update Job)
3. Session cleanup → **background-jobs.md** (Session Cleanup Job)
4. Leaderboard → **background-jobs.md** (Leaderboard Reset/Recalc)

---

## 📊 Implementation Checklist

Use this checklist to track implementation progress:

### Phase 1: Foundation
- [ ] Setup NestJS project with folder structure (see application-architecture.md)
- [ ] Setup Prisma with schema (see prisma-schema.txt)
- [ ] Run migrations and seed (see seed-instructions.md)
- [ ] Setup shared infrastructure (PrismaService, EventBus, Logger)
- [ ] Setup authentication (JWT strategy, guards)

### Phase 2: Identity Context
- [ ] User entity and repository
- [ ] Register/Login commands
- [ ] JWT token generation
- [ ] Refresh token handling
- [ ] Auth controller

### Phase 3: Quiz Context
- [ ] QuizSession aggregate
- [ ] Question selection service
- [ ] Scoring service
- [ ] StartQuiz command/handler
- [ ] SubmitAnswer command/handler
- [ ] Quiz controller
- [ ] Anti-cheat validation

### Phase 4: Gamification Context
- [ ] PlayerProgress aggregate
- [ ] ExperienceCalculator service
- [ ] LevelCalculator service
- [ ] StreakCalculator service
- [ ] BadgeEvaluator service
- [ ] Event handlers (QuizCompleted, etc.)
- [ ] Gamification controller

### Phase 5: Economy Context
- [ ] Wallet aggregate
- [ ] Lives aggregate
- [ ] Transaction tracking
- [ ] Shop items
- [ ] Purchase handlers
- [ ] Event handlers (LevelUp, BadgeUnlocked)
- [ ] Economy controllers

### Phase 6: Leaderboard Context
- [ ] PlayerRanking entity
- [ ] Ranking calculation
- [ ] Leaderboard queries
- [ ] Redis caching
- [ ] Leaderboard controller

### Phase 7: Content Context (Admin)
- [ ] Question management (CRUD)
- [ ] Admin authorization
- [ ] Question publishing workflow
- [ ] Admin controller

### Phase 8: Background Jobs
- [ ] Life regeneration job
- [ ] Streak update job
- [ ] Session cleanup job
- [ ] Leaderboard recalc job
- [ ] Leaderboard reset job
- [ ] Job health monitoring

### Phase 9: Testing
- [ ] Unit tests (domain logic)
- [ ] Integration tests (API endpoints)
- [ ] E2E tests (full flows)
- [ ] Load tests (performance)

### Phase 10: Production Readiness
- [ ] Error handling & logging
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Security headers
- [ ] Health checks
- [ ] Swagger documentation
- [ ] Docker configuration
- [ ] Environment variables

---

## 🧪 Testing Strategy

### Unit Tests (Domain Layer)
Focus: Business logic, invariants, calculations

```typescript
// Example: QuizSession.spec.ts
describe('QuizSession', () => {
  it('should apply perfect score bonus (x1.5)');
  it('should throw if session expired');
  it('should not allow answering same question twice');
});
```

**Files to test:**
- All aggregates (QuizSession, PlayerProgress, Wallet, Lives)
- All value objects (Score, Difficulty, Experience)
- All domain services (ScoringService, LevelCalculator, StreakCalculator)

### Integration Tests (Application Layer)
Focus: Command/Query handlers, database interactions

```typescript
// Example: StartQuizHandler.integration.spec.ts
describe('StartQuizHandler', () => {
  it('should create session and consume life');
  it('should throw if insufficient lives');
  it('should emit QuizStartedEvent');
});
```

### E2E Tests (Full API)
Focus: Complete user flows

```typescript
// Example: quiz-flow.e2e.spec.ts
describe('Complete Quiz Flow', () => {
  it('should allow user to complete full quiz');
  it('should update XP, streak, coins, and leaderboard');
});
```

---

## 🔍 Common Implementation Patterns

### Creating a New Command

1. Define command class
```typescript
// application/commands/do-something/do-something.command.ts
export class DoSomethingCommand {
  constructor(public readonly userId: string, ...) {}
}
```

2. Create handler
```typescript
// application/commands/do-something/do-something.handler.ts
@CommandHandler(DoSomethingCommand)
export class DoSomethingHandler {
  async execute(command: DoSomethingCommand): Promise<ResultDto> {
    // 1. Validate
    // 2. Load aggregate
    // 3. Execute domain logic
    // 4. Save
    // 5. Publish events
  }
}
```

3. Add to controller
```typescript
@Post('something')
async doSomething(@Body() dto: DoSomethingDto) {
  const command = new DoSomethingCommand(...);
  return this.commandBus.execute(command);
}
```

### Creating a New Event Handler

1. Define event
```typescript
// domain/events/something-happened.event.ts
export class SomethingHappenedEvent extends DomainEvent {
  constructor(public readonly data: string) {
    super();
  }
}
```

2. Create handler
```typescript
// application/event-handlers/something-happened.handler.ts
@EventHandler(SomethingHappenedEvent)
export class SomethingHappenedHandler {
  @OnEvent(SomethingHappenedEvent.name)
  async handle(event: SomethingHappenedEvent): Promise<void> {
    // React to event
  }
}
```

### Creating a New Aggregate

1. Define aggregate
```typescript
// domain/aggregates/my-aggregate.aggregate.ts
export class MyAggregate extends AggregateRoot {
  private constructor(...) { super(id); }

  static create(...): MyAggregate {
    const aggregate = new MyAggregate(...);
    aggregate.addDomainEvent(new CreatedEvent(...));
    return aggregate;
  }

  doSomething(): void {
    // Business logic
    this.addDomainEvent(new SomethingDoneEvent(...));
  }
}
```

2. Define repository interface
```typescript
// domain/repositories/my-aggregate.repository.interface.ts
export interface IMyAggregateRepository {
  save(aggregate: MyAggregate): Promise<void>;
  findById(id: string): Promise<MyAggregate | null>;
}
```

3. Implement repository
```typescript
// infrastructure/persistence/my-aggregate.repository.ts
@Injectable()
export class MyAggregateRepository implements IMyAggregateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(aggregate: MyAggregate): Promise<void> {
    await this.prisma.myModel.upsert({
      where: { id: aggregate.id },
      create: this.toDto(aggregate),
      update: this.toDto(aggregate),
    });
  }
}
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ Don't: Put business logic in controllers
```typescript
// BAD
@Post('quiz/start')
async startQuiz(@Body() dto: StartQuizDto) {
  const lives = await this.livesRepo.findByUserId(userId);
  if (lives.currentLives < 1) throw new Error();
  lives.currentLives--;
  // ... more logic in controller
}
```

### ✅ Do: Put business logic in domain/application layer
```typescript
// GOOD
@Post('quiz/start')
async startQuiz(@Body() dto: StartQuizDto) {
  const command = new StartQuizCommand(userId, dto.difficulty);
  return this.commandBus.execute(command);
}
```

### ❌ Don't: Import Prisma in domain layer
```typescript
// BAD - domain/aggregates/quiz-session.ts
import { PrismaService } from '@shared/infrastructure';
```

### ✅ Do: Use repository interfaces
```typescript
// GOOD - domain/repositories/quiz-session.repository.interface.ts
export interface IQuizSessionRepository {
  save(session: QuizSession): Promise<void>;
}
```

### ❌ Don't: Emit events directly from controllers
```typescript
// BAD
@Post('quiz/:id/complete')
async completeQuiz(@Param('id') id: string) {
  // ... logic
  this.eventBus.publish(new QuizCompletedEvent(...));
}
```

### ✅ Do: Emit events from aggregates
```typescript
// GOOD - domain/aggregates/quiz-session.ts
complete(): void {
  this.status = SessionStatus.COMPLETED;
  this.addDomainEvent(new QuizCompletedEvent(...)); // Aggregate emits
}
```

---

## 📞 Need Help?

### Documentation References

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **DDD Patterns**: architecture/02-Bounded-Contexts/
- **Business Rules**: architecture/01-Domain-Discovery/Regles-Metier.md

### Architecture Questions

If unsure about:
- **Folder structure** → application-architecture.md
- **API endpoints** → api-design.md
- **Business rules** → business-rules-implementation.md
- **Event flow** → event-architecture.md
- **Validation** → validation-and-security.md
- **Cron jobs** → background-jobs.md

---

## ✅ Documentation Complete

All critical technical architecture documentation is now complete and ready for implementation.

**What's documented:**
- ✅ Full application architecture (Clean Architecture + DDD)
- ✅ Complete Prisma schema with all models
- ✅ All API endpoints with request/response specs
- ✅ All business rules mapped to code
- ✅ Complete event-driven architecture
- ✅ All validation and security rules
- ✅ All background jobs with schedules
- ✅ Seeding strategy

**Ready for:**
- Backend development start
- Claude agent code generation
- Team collaboration
- Implementation without ambiguity

🚀 **You can now confidently ask Claude agents to build the backend!**

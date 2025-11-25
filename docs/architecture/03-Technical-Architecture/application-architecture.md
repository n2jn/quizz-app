# 🏗️ Application Architecture - PastryQuiz Backend

## Stack Overview

```yaml
Framework: NestJS 10.x (TypeScript)
Architecture: Clean Architecture + DDD + Modular Monolith
Database: PostgreSQL 15+ (via Prisma ORM)
Cache: Redis 7+
Events: NestJS EventEmitter (in-process)
Auth: Passport JWT
Validation: class-validator + class-transformer
Documentation: Swagger/OpenAPI
Testing: Jest + Supertest
```

---

## Architecture Principles

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                         │
│              (Controllers, Guards, DTOs)                │
├─────────────────────────────────────────────────────────┤
│                    APPLICATION                          │
│          (Use Cases, Command Handlers, Queries)         │
├─────────────────────────────────────────────────────────┤
│                      DOMAIN                             │
│       (Entities, Aggregates, Value Objects, Events)     │
├─────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE                        │
│    (Prisma Repositories, Redis, External Services)      │
└─────────────────────────────────────────────────────────┘
```

### Dependency Rules

- **Domain** has ZERO dependencies (pure TypeScript)
- **Application** depends only on Domain
- **Infrastructure** depends on Domain + Application
- **Presentation** depends on Application (not Domain directly)

---

## Project Structure

```
apps/
└── backend/
    ├── src/
    │   ├── main.ts                          # Bootstrap
    │   ├── app.module.ts                    # Root module
    │   │
    │   ├── modules/                         # Bounded Contexts
    │   │   ├── identity/
    │   │   │   ├── identity.module.ts
    │   │   │   ├── domain/
    │   │   │   │   ├── entities/
    │   │   │   │   │   └── user.entity.ts
    │   │   │   │   ├── value-objects/
    │   │   │   │   │   ├── email.vo.ts
    │   │   │   │   │   └── password.vo.ts
    │   │   │   │   ├── events/
    │   │   │   │   │   ├── user-registered.event.ts
    │   │   │   │   │   └── user-logged-in.event.ts
    │   │   │   │   └── repositories/
    │   │   │   │       └── user.repository.interface.ts
    │   │   │   ├── application/
    │   │   │   │   ├── commands/
    │   │   │   │   │   ├── register-user/
    │   │   │   │   │   │   ├── register-user.command.ts
    │   │   │   │   │   │   └── register-user.handler.ts
    │   │   │   │   │   └── login-user/
    │   │   │   │   │       ├── login-user.command.ts
    │   │   │   │   │       └── login-user.handler.ts
    │   │   │   │   ├── queries/
    │   │   │   │   │   └── get-user-profile/
    │   │   │   │   │       ├── get-user-profile.query.ts
    │   │   │   │   │       └── get-user-profile.handler.ts
    │   │   │   │   └── services/
    │   │   │   │       └── auth.service.ts
    │   │   │   ├── infrastructure/
    │   │   │   │   ├── persistence/
    │   │   │   │   │   └── user.repository.ts
    │   │   │   │   └── strategies/
    │   │   │   │       ├── jwt.strategy.ts
    │   │   │   │       └── refresh-token.strategy.ts
    │   │   │   └── presentation/
    │   │   │       ├── controllers/
    │   │   │       │   └── auth.controller.ts
    │   │   │       ├── dtos/
    │   │   │       │   ├── register.dto.ts
    │   │   │       │   ├── login.dto.ts
    │   │   │       │   └── user-response.dto.ts
    │   │   │       └── guards/
    │   │   │           └── jwt-auth.guard.ts
    │   │   │
    │   │   ├── quiz/
    │   │   │   ├── quiz.module.ts
    │   │   │   ├── domain/
    │   │   │   │   ├── aggregates/
    │   │   │   │   │   └── quiz-session.aggregate.ts
    │   │   │   │   ├── entities/
    │   │   │   │   │   ├── question.entity.ts
    │   │   │   │   │   ├── answer.entity.ts
    │   │   │   │   │   └── session-answer.entity.ts
    │   │   │   │   ├── value-objects/
    │   │   │   │   │   ├── score.vo.ts
    │   │   │   │   │   ├── time-bonus.vo.ts
    │   │   │   │   │   └── difficulty.vo.ts
    │   │   │   │   ├── events/
    │   │   │   │   │   ├── quiz-started.event.ts
    │   │   │   │   │   ├── question-answered.event.ts
    │   │   │   │   │   ├── quiz-completed.event.ts
    │   │   │   │   │   └── perfect-score-achieved.event.ts
    │   │   │   │   └── repositories/
    │   │   │   │       ├── quiz-session.repository.interface.ts
    │   │   │   │       └── question.repository.interface.ts
    │   │   │   ├── application/
    │   │   │   │   ├── commands/
    │   │   │   │   │   ├── start-quiz/
    │   │   │   │   │   ├── submit-answer/
    │   │   │   │   │   ├── use-hint/
    │   │   │   │   │   └── abandon-quiz/
    │   │   │   │   ├── queries/
    │   │   │   │   │   ├── get-current-question/
    │   │   │   │   │   ├── get-quiz-result/
    │   │   │   │   │   └── get-categories/
    │   │   │   │   └── services/
    │   │   │   │       ├── quiz-orchestrator.service.ts
    │   │   │   │       ├── question-selector.service.ts
    │   │   │   │       └── scoring.service.ts
    │   │   │   ├── infrastructure/
    │   │   │   │   └── persistence/
    │   │   │   │       ├── quiz-session.repository.ts
    │   │   │   │       └── question.repository.ts
    │   │   │   └── presentation/
    │   │   │       ├── controllers/
    │   │   │       │   └── quiz.controller.ts
    │   │   │       └── dtos/
    │   │   │           ├── start-quiz.dto.ts
    │   │   │           ├── submit-answer.dto.ts
    │   │   │           └── quiz-result.dto.ts
    │   │   │
    │   │   ├── gamification/
    │   │   │   ├── gamification.module.ts
    │   │   │   ├── domain/
    │   │   │   │   ├── aggregates/
    │   │   │   │   │   └── player-progress.aggregate.ts
    │   │   │   │   ├── entities/
    │   │   │   │   │   ├── badge.entity.ts
    │   │   │   │   │   └── category-stat.entity.ts
    │   │   │   │   ├── value-objects/
    │   │   │   │   │   ├── experience.vo.ts
    │   │   │   │   │   ├── level.vo.ts
    │   │   │   │   │   └── streak.vo.ts
    │   │   │   │   ├── events/
    │   │   │   │   │   ├── experience-gained.event.ts
    │   │   │   │   │   ├── level-up.event.ts
    │   │   │   │   │   ├── badge-unlocked.event.ts
    │   │   │   │   │   └── streak-updated.event.ts
    │   │   │   │   └── services/
    │   │   │   │       ├── level-calculator.service.ts
    │   │   │   │       ├── badge-evaluator.service.ts
    │   │   │   │       └── streak-calculator.service.ts
    │   │   │   ├── application/
    │   │   │   │   ├── commands/
    │   │   │   │   │   ├── add-experience/
    │   │   │   │   │   ├── unlock-badge/
    │   │   │   │   │   └── update-streak/
    │   │   │   │   ├── queries/
    │   │   │   │   │   ├── get-player-progress/
    │   │   │   │   │   ├── get-badges/
    │   │   │   │   │   └── get-stats/
    │   │   │   │   └── event-handlers/
    │   │   │   │       ├── quiz-completed.handler.ts
    │   │   │   │       └── perfect-score.handler.ts
    │   │   │   ├── infrastructure/
    │   │   │   │   └── persistence/
    │   │   │   │       └── player-progress.repository.ts
    │   │   │   └── presentation/
    │   │   │       ├── controllers/
    │   │   │       │   └── gamification.controller.ts
    │   │   │       └── dtos/
    │   │   │           └── progress-response.dto.ts
    │   │   │
    │   │   ├── leaderboard/
    │   │   │   ├── leaderboard.module.ts
    │   │   │   ├── domain/
    │   │   │   │   ├── entities/
    │   │   │   │   │   └── player-ranking.entity.ts
    │   │   │   │   └── repositories/
    │   │   │   │       └── ranking.repository.interface.ts
    │   │   │   ├── application/
    │   │   │   │   ├── queries/
    │   │   │   │   │   ├── get-weekly-leaderboard/
    │   │   │   │   │   ├── get-global-leaderboard/
    │   │   │   │   │   └── get-nearby-ranking/
    │   │   │   │   └── event-handlers/
    │   │   │   │       └── quiz-completed.handler.ts
    │   │   │   ├── infrastructure/
    │   │   │   │   ├── persistence/
    │   │   │   │   │   └── ranking.repository.ts
    │   │   │   │   └── cache/
    │   │   │   │       └── leaderboard.cache.ts
    │   │   │   └── presentation/
    │   │   │       ├── controllers/
    │   │   │       │   └── leaderboard.controller.ts
    │   │   │       └── dtos/
    │   │   │           └── ranking-response.dto.ts
    │   │   │
    │   │   ├── economy/
    │   │   │   ├── economy.module.ts
    │   │   │   ├── domain/
    │   │   │   │   ├── aggregates/
    │   │   │   │   │   ├── wallet.aggregate.ts
    │   │   │   │   │   └── lives.aggregate.ts
    │   │   │   │   ├── entities/
    │   │   │   │   │   ├── transaction.entity.ts
    │   │   │   │   │   └── shop-item.entity.ts
    │   │   │   │   ├── value-objects/
    │   │   │   │   │   ├── coin-amount.vo.ts
    │   │   │   │   │   └── life-count.vo.ts
    │   │   │   │   ├── events/
    │   │   │   │   │   ├── coins-earned.event.ts
    │   │   │   │   │   ├── coins-spent.event.ts
    │   │   │   │   │   └── life-consumed.event.ts
    │   │   │   │   └── services/
    │   │   │   │       ├── wallet.service.ts
    │   │   │   │       └── lives.service.ts
    │   │   │   ├── application/
    │   │   │   │   ├── commands/
    │   │   │   │   │   ├── purchase-item/
    │   │   │   │   │   ├── consume-life/
    │   │   │   │   │   └── add-coins/
    │   │   │   │   ├── queries/
    │   │   │   │   │   ├── get-wallet/
    │   │   │   │   │   ├── get-lives/
    │   │   │   │   │   └── get-shop-items/
    │   │   │   │   └── event-handlers/
    │   │   │   │       ├── level-up.handler.ts
    │   │   │   │       └── badge-unlocked.handler.ts
    │   │   │   ├── infrastructure/
    │   │   │   │   └── persistence/
    │   │   │   │       ├── wallet.repository.ts
    │   │   │   │       └── transaction.repository.ts
    │   │   │   └── presentation/
    │   │   │       ├── controllers/
    │   │   │       │   ├── wallet.controller.ts
    │   │   │       │   ├── shop.controller.ts
    │   │   │       │   └── lives.controller.ts
    │   │   │       └── dtos/
    │   │   │           └── purchase.dto.ts
    │   │   │
    │   │   └── content/
    │   │       ├── content.module.ts
    │   │       ├── domain/
    │   │       │   ├── entities/
    │   │       │   │   └── question.entity.ts (shared with quiz)
    │   │       │   └── repositories/
    │   │       │       └── question-admin.repository.interface.ts
    │   │       ├── application/
    │   │       │   ├── commands/
    │   │       │   │   ├── create-question/
    │   │       │   │   ├── update-question/
    │   │       │   │   ├── publish-question/
    │   │       │   │   └── delete-question/
    │   │       │   └── queries/
    │   │       │       └── list-questions/
    │   │       ├── infrastructure/
    │   │       │   └── persistence/
    │   │       │       └── question-admin.repository.ts
    │   │       └── presentation/
    │   │           ├── controllers/
    │   │           │   └── admin-questions.controller.ts
    │   │           └── dtos/
    │   │               └── create-question.dto.ts
    │   │
    │   ├── shared/                          # Cross-cutting concerns
    │   │   ├── domain/
    │   │   │   ├── base/
    │   │   │   │   ├── entity.base.ts
    │   │   │   │   ├── aggregate-root.base.ts
    │   │   │   │   └── value-object.base.ts
    │   │   │   ├── events/
    │   │   │   │   ├── domain-event.base.ts
    │   │   │   │   └── event-bus.interface.ts
    │   │   │   └── exceptions/
    │   │   │       ├── domain.exception.ts
    │   │   │       ├── not-found.exception.ts
    │   │   │       └── validation.exception.ts
    │   │   ├── infrastructure/
    │   │   │   ├── database/
    │   │   │   │   ├── prisma.service.ts
    │   │   │   │   └── base.repository.ts
    │   │   │   ├── cache/
    │   │   │   │   ├── redis.service.ts
    │   │   │   │   └── cache.decorator.ts
    │   │   │   ├── events/
    │   │   │   │   └── event-emitter.adapter.ts
    │   │   │   └── logging/
    │   │   │       └── logger.service.ts
    │   │   ├── presentation/
    │   │   │   ├── filters/
    │   │   │   │   ├── http-exception.filter.ts
    │   │   │   │   └── domain-exception.filter.ts
    │   │   │   ├── interceptors/
    │   │   │   │   ├── response.interceptor.ts
    │   │   │   │   ├── logging.interceptor.ts
    │   │   │   │   └── timeout.interceptor.ts
    │   │   │   ├── guards/
    │   │   │   │   ├── roles.guard.ts
    │   │   │   │   └── rate-limit.guard.ts
    │   │   │   └── decorators/
    │   │   │       ├── current-user.decorator.ts
    │   │   │       └── roles.decorator.ts
    │   │   └── utils/
    │   │       ├── pagination.ts
    │   │       ├── time.utils.ts
    │   │       └── crypto.utils.ts
    │   │
    │   ├── config/                          # Configuration
    │   │   ├── app.config.ts
    │   │   ├── database.config.ts
    │   │   ├── redis.config.ts
    │   │   ├── jwt.config.ts
    │   │   └── swagger.config.ts
    │   │
    │   └── cron/                            # Background Jobs
    │       ├── cron.module.ts
    │       ├── jobs/
    │       │   ├── life-regen.job.ts
    │       │   ├── leaderboard-reset.job.ts
    │       │   ├── streak-update.job.ts
    │       │   └── session-cleanup.job.ts
    │       └── schedulers/
    │           └── job-scheduler.service.ts
    │
    ├── test/
    │   ├── unit/
    │   ├── integration/
    │   └── e2e/
    │
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── migrations/
    │
    ├── .env
    ├── .env.example
    ├── tsconfig.json
    ├── nest-cli.json
    └── package.json
```

---

## Module Organization

### Bounded Context Modules

Each bounded context is a **self-contained NestJS module**:

```typescript
// modules/quiz/quiz.module.ts
@Module({
  imports: [
    PrismaModule,
    EventEmitterModule,
  ],
  providers: [
    // Domain Services
    ScoringService,
    QuestionSelectorService,

    // Repositories
    {
      provide: 'QUIZ_SESSION_REPOSITORY',
      useClass: QuizSessionRepository,
    },
    {
      provide: 'QUESTION_REPOSITORY',
      useClass: QuestionRepository,
    },

    // Command Handlers
    StartQuizHandler,
    SubmitAnswerHandler,
    UseHintHandler,
    AbandonQuizHandler,

    // Query Handlers
    GetCurrentQuestionHandler,
    GetQuizResultHandler,
    GetCategoriesHandler,
  ],
  controllers: [QuizController],
  exports: [
    // Expose for other modules
    'QUESTION_REPOSITORY',
  ],
})
export class QuizModule {}
```

### Dependency Injection Pattern

```typescript
// Repository Interface (Domain)
export interface IQuizSessionRepository {
  save(session: QuizSession): Promise<void>;
  findById(id: string): Promise<QuizSession | null>;
  findActiveByUserId(userId: string): Promise<QuizSession | null>;
}

// Repository Implementation (Infrastructure)
@Injectable()
export class QuizSessionRepository implements IQuizSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: QuizSession): Promise<void> {
    await this.prisma.quizSession.upsert({
      where: { id: session.id },
      create: this.toDto(session),
      update: this.toDto(session),
    });
  }

  // ... other methods

  private toDto(session: QuizSession): PrismaQuizSessionDto {
    // Map domain entity to Prisma DTO
  }

  private toDomain(dto: PrismaQuizSessionDto): QuizSession {
    // Map Prisma DTO to domain entity
  }
}

// Usage in Command Handler
@CommandHandler(StartQuizCommand)
export class StartQuizHandler {
  constructor(
    @Inject('QUIZ_SESSION_REPOSITORY')
    private readonly sessionRepo: IQuizSessionRepository,
    @Inject('QUESTION_REPOSITORY')
    private readonly questionRepo: IQuestionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: StartQuizCommand): Promise<QuizSessionDto> {
    // 1. Validate
    // 2. Create aggregate
    const session = QuizSession.start(command.userId, ...);

    // 3. Save
    await this.sessionRepo.save(session);

    // 4. Emit events
    session.events.forEach(event => this.eventBus.publish(event));

    return this.toDto(session);
  }
}
```

---

## Domain Layer Design

### Aggregate Root Pattern

```typescript
// domain/aggregates/quiz-session.aggregate.ts
export class QuizSession extends AggregateRoot {
  private constructor(
    id: string,
    private userId: string,
    private questions: Question[],
    private answers: SessionAnswer[],
    private score: Score,
    private status: SessionStatus,
    private difficulty: Difficulty,
    private expiresAt: Date,
  ) {
    super(id);
  }

  // Factory Method
  static start(
    userId: string,
    category: string,
    difficulty: Difficulty,
    questions: Question[],
  ): QuizSession {
    const session = new QuizSession(
      uuid(),
      userId,
      questions,
      [],
      Score.zero(),
      SessionStatus.IN_PROGRESS,
      difficulty,
      new Date(Date.now() + 10 * 60 * 1000),
    );

    session.addDomainEvent(new QuizStartedEvent(session.id, userId, category));
    return session;
  }

  // Business Logic
  submitAnswer(questionId: string, answerId: string, timeSpent: number): void {
    // Validation
    if (this.status !== SessionStatus.IN_PROGRESS) {
      throw new InvalidSessionStateException();
    }

    if (this.hasExpired()) {
      this.status = SessionStatus.ABANDONED;
      throw new SessionExpiredException();
    }

    const question = this.findQuestion(questionId);
    const isCorrect = question.validateAnswer(answerId);

    // Calculate points
    const basePoints = this.difficulty.basePoints;
    const timeBonus = this.calculateTimeBonus(timeSpent, question.timeLimit);
    const points = isCorrect ? basePoints + timeBonus : 0;

    // Record answer
    const answer = new SessionAnswer(questionId, answerId, isCorrect, timeSpent, points);
    this.answers.push(answer);
    this.score = this.score.add(points);

    // Events
    this.addDomainEvent(new QuestionAnsweredEvent(
      this.id,
      this.userId,
      questionId,
      isCorrect,
      points,
    ));

    // Check completion
    if (this.isComplete()) {
      this.complete();
    }
  }

  private complete(): void {
    this.status = SessionStatus.COMPLETED;

    this.addDomainEvent(new QuizCompletedEvent(
      this.id,
      this.userId,
      this.score.value,
      this.correctAnswersCount(),
      this.questions.length,
    ));

    if (this.isPerfectScore()) {
      this.addDomainEvent(new PerfectScoreAchievedEvent(
        this.id,
        this.userId,
        this.difficulty.level,
      ));
    }
  }

  // Getters
  get currentScore(): number {
    return this.score.value;
  }

  isComplete(): boolean {
    return this.answers.length === this.questions.length;
  }

  isPerfectScore(): boolean {
    return this.correctAnswersCount() === this.questions.length;
  }

  private correctAnswersCount(): number {
    return this.answers.filter(a => a.isCorrect).length;
  }

  private hasExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  private calculateTimeBonus(timeSpent: number, timeLimit: number): number {
    const remainingTime = timeLimit - timeSpent;
    if (remainingTime <= 0) return 0;

    const percentageRemaining = remainingTime / timeLimit;
    return Math.floor(percentageRemaining * 50); // Max 50 bonus points
  }

  private findQuestion(id: string): Question {
    const question = this.questions.find(q => q.id === id);
    if (!question) throw new QuestionNotFoundException(id);
    return question;
  }
}
```

### Value Object Pattern

```typescript
// domain/value-objects/score.vo.ts
export class Score extends ValueObject {
  constructor(public readonly value: number) {
    super();
    if (value < 0) {
      throw new Error('Score cannot be negative');
    }
  }

  static zero(): Score {
    return new Score(0);
  }

  add(points: number): Score {
    return new Score(this.value + points);
  }

  protected getEqualityComponents(): any[] {
    return [this.value];
  }
}
```

### Domain Event Pattern

```typescript
// domain/events/quiz-completed.event.ts
export class QuizCompletedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly finalScore: number,
    public readonly correctAnswers: number,
    public readonly totalQuestions: number,
  ) {
    super();
  }

  get aggregateId(): string {
    return this.sessionId;
  }
}
```

---

## Application Layer - CQRS Pattern

### Command Handler

```typescript
// application/commands/submit-answer/submit-answer.command.ts
export class SubmitAnswerCommand {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly questionId: string,
    public readonly answerId: string,
    public readonly timeSpent: number,
  ) {}
}

// application/commands/submit-answer/submit-answer.handler.ts
@CommandHandler(SubmitAnswerCommand)
export class SubmitAnswerHandler implements ICommandHandler<SubmitAnswerCommand> {
  constructor(
    @Inject('QUIZ_SESSION_REPOSITORY')
    private readonly sessionRepo: IQuizSessionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SubmitAnswerCommand): Promise<SubmitAnswerResult> {
    // 1. Load aggregate
    const session = await this.sessionRepo.findById(command.sessionId);
    if (!session) throw new SessionNotFoundException();

    // 2. Verify ownership
    if (session.userId !== command.userId) {
      throw new UnauthorizedAccessException();
    }

    // 3. Execute business logic
    session.submitAnswer(command.questionId, command.answerId, command.timeSpent);

    // 4. Persist
    await this.sessionRepo.save(session);

    // 5. Publish events
    session.events.forEach(event => this.eventBus.publish(event));
    session.clearEvents();

    // 6. Return result
    return {
      isCorrect: session.getAnswer(command.questionId).isCorrect,
      pointsEarned: session.getAnswer(command.questionId).pointsEarned,
      currentScore: session.currentScore,
      nextQuestion: session.getNextQuestion(),
    };
  }
}
```

### Query Handler

```typescript
// application/queries/get-quiz-result/get-quiz-result.query.ts
export class GetQuizResultQuery {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
  ) {}
}

// application/queries/get-quiz-result/get-quiz-result.handler.ts
@QueryHandler(GetQuizResultQuery)
export class GetQuizResultHandler implements IQueryHandler<GetQuizResultQuery> {
  constructor(
    @Inject('QUIZ_SESSION_REPOSITORY')
    private readonly sessionRepo: IQuizSessionRepository,
  ) {}

  async execute(query: GetQuizResultQuery): Promise<QuizResultDto> {
    const session = await this.sessionRepo.findById(query.sessionId);
    if (!session) throw new SessionNotFoundException();
    if (session.userId !== query.userId) throw new UnauthorizedAccessException();

    return {
      sessionId: session.id,
      finalScore: session.currentScore,
      correctAnswers: session.correctAnswersCount(),
      totalQuestions: session.questions.length,
      isPerfect: session.isPerfectScore(),
      completedAt: session.completedAt,
    };
  }
}
```

### Event Handler (Cross-Context)

```typescript
// gamification/application/event-handlers/quiz-completed.handler.ts
@EventHandler(QuizCompletedEvent)
export class QuizCompletedEventHandler implements IEventHandler<QuizCompletedEvent> {
  constructor(
    private readonly addExperienceHandler: AddExperienceHandler,
    private readonly updateStreakHandler: UpdateStreakHandler,
  ) {}

  async handle(event: QuizCompletedEvent): Promise<void> {
    // Add experience
    const xpMultiplier = this.getXpMultiplier(event.difficulty);
    const xpEarned = event.correctAnswers * 100 * xpMultiplier;

    await this.addExperienceHandler.execute(
      new AddExperienceCommand(event.userId, xpEarned)
    );

    // Update streak
    await this.updateStreakHandler.execute(
      new UpdateStreakCommand(event.userId)
    );
  }
}
```

---

## Presentation Layer

### Controller

```typescript
// presentation/controllers/quiz.controller.ts
@Controller('api/v1/quiz')
@UseGuards(JwtAuthGuard)
@ApiTags('Quiz')
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('start')
  @HttpCode(201)
  @ApiOperation({ summary: 'Start a new quiz session' })
  @ApiResponse({ status: 201, type: QuizSessionResponse })
  @ApiResponse({ status: 422, description: 'Insufficient lives' })
  async startQuiz(
    @CurrentUser() user: UserPayload,
    @Body() dto: StartQuizDto,
  ): Promise<QuizSessionResponse> {
    const command = new StartQuizCommand(
      user.userId,
      dto.category,
      dto.difficulty,
    );

    return this.commandBus.execute(command);
  }

  @Post(':sessionId/answer')
  @HttpCode(200)
  @ApiOperation({ summary: 'Submit an answer' })
  async submitAnswer(
    @CurrentUser() user: UserPayload,
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitAnswerDto,
  ): Promise<SubmitAnswerResponse> {
    const command = new SubmitAnswerCommand(
      sessionId,
      user.userId,
      dto.questionId,
      dto.answerId,
      dto.timeSpent,
    );

    return this.commandBus.execute(command);
  }

  @Get(':sessionId/result')
  @ApiOperation({ summary: 'Get quiz result' })
  async getResult(
    @CurrentUser() user: UserPayload,
    @Param('sessionId') sessionId: string,
  ): Promise<QuizResultResponse> {
    const query = new GetQuizResultQuery(sessionId, user.userId);
    return this.queryBus.execute(query);
  }
}
```

### DTO with Validation

```typescript
// presentation/dtos/start-quiz.dto.ts
export class StartQuizDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Category slug (null = random)' })
  category?: string;

  @IsEnum(['apprenti', 'commis', 'chef', 'mof'])
  @ApiProperty({ enum: ['apprenti', 'commis', 'chef', 'mof'] })
  difficulty: string;
}
```

---

## Shared Kernel

### Base Entity

```typescript
// shared/domain/base/entity.base.ts
export abstract class Entity<T> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  get id(): T {
    return this._id;
  }

  equals(entity: Entity<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
```

### Base Aggregate Root

```typescript
// shared/domain/base/aggregate-root.base.ts
export abstract class AggregateRoot extends Entity<string> {
  private _domainEvents: DomainEvent[] = [];

  get events(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}
```

### Domain Exceptions

```typescript
// shared/domain/exceptions/domain.exception.ts
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SessionExpiredException extends DomainException {
  constructor() {
    super('Quiz session has expired');
  }
}

export class InsufficientLivesException extends DomainException {
  constructor(required: number, current: number) {
    super(`Insufficient lives. Required: ${required}, Current: ${current}`);
  }
}
```

### Exception Filter

```typescript
// shared/presentation/filters/domain-exception.filter.ts
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = {
      error: {
        code: exception.name,
        message: exception.message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    response.status(422).json(errorResponse);
  }
}
```

---

## Event-Driven Communication

### Event Emitter Setup

```typescript
// app.module.ts
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    // ... bounded context modules
  ],
})
export class AppModule {}
```

### Event Publishing

```typescript
// shared/infrastructure/events/event-emitter.adapter.ts
@Injectable()
export class EventBus {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(event: DomainEvent): void {
    this.eventEmitter.emit(event.constructor.name, event);
  }

  publishAll(events: DomainEvent[]): void {
    events.forEach(event => this.publish(event));
  }
}
```

### Event Subscription

```typescript
// Event handler decorator
@EventHandler(QuizCompletedEvent)
export class QuizCompletedHandler implements IEventHandler<QuizCompletedEvent> {
  constructor(
    private readonly gamificationService: GamificationService,
  ) {}

  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    await this.gamificationService.handleQuizCompletion(event);
  }
}
```

---

## Database Access - Repository Pattern

### Base Repository

```typescript
// shared/infrastructure/database/base.repository.ts
export abstract class BaseRepository<TEntity, TDto> {
  constructor(protected readonly prisma: PrismaService) {}

  protected abstract toDomain(dto: TDto): TEntity;
  protected abstract toDto(entity: TEntity): TDto;

  async findById(id: string): Promise<TEntity | null> {
    const dto = await this.findDtoById(id);
    return dto ? this.toDomain(dto) : null;
  }

  protected abstract findDtoById(id: string): Promise<TDto | null>;
}
```

### Concrete Repository

```typescript
// infrastructure/persistence/quiz-session.repository.ts
@Injectable()
export class QuizSessionRepository
  extends BaseRepository<QuizSession, PrismaQuizSession>
  implements IQuizSessionRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async save(session: QuizSession): Promise<void> {
    const dto = this.toDto(session);

    await this.prisma.quizSession.upsert({
      where: { id: session.id },
      create: dto,
      update: dto,
    });
  }

  async findActiveByUserId(userId: string): Promise<QuizSession | null> {
    const dto = await this.prisma.quizSession.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
        expiresAt: { gt: new Date() },
      },
      include: {
        category: true,
        difficulty: true,
        answers: {
          include: { question: true },
        },
      },
    });

    return dto ? this.toDomain(dto) : null;
  }

  protected async findDtoById(id: string): Promise<PrismaQuizSession | null> {
    return this.prisma.quizSession.findUnique({
      where: { id },
      include: {
        category: true,
        difficulty: true,
        answers: {
          include: { question: true },
        },
      },
    });
  }

  protected toDomain(dto: PrismaQuizSession): QuizSession {
    // Complex mapping logic from Prisma DTO to Domain entity
    return QuizSession.reconstitute(
      dto.id,
      dto.userId,
      // ... map all properties
    );
  }

  protected toDto(session: QuizSession): PrismaQuizSession {
    // Map domain entity to Prisma DTO
    return {
      id: session.id,
      userId: session.userId,
      // ... map all properties
    };
  }
}
```

---

## Configuration Management

### Environment Variables

```typescript
// config/app.config.ts
export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: 'v1',
}));

// config/database.config.ts
export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));

// config/jwt.config.ts
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
```

### Configuration Module

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
      }),
    }),
    // ...
  ],
})
export class AppModule {}
```

---

## Testing Structure

### Unit Test Example

```typescript
// quiz/domain/aggregates/quiz-session.aggregate.spec.ts
describe('QuizSession', () => {
  describe('submitAnswer', () => {
    it('should accept correct answer and award points', () => {
      // Arrange
      const session = QuizSessionTestFactory.create();
      const question = session.questions[0];
      const correctAnswer = question.correctAnswer;

      // Act
      session.submitAnswer(question.id, correctAnswer.id, 5000);

      // Assert
      expect(session.currentScore).toBeGreaterThan(0);
      expect(session.correctAnswersCount()).toBe(1);
    });

    it('should throw exception if session expired', () => {
      // Arrange
      const session = QuizSessionTestFactory.createExpired();

      // Act & Assert
      expect(() => {
        session.submitAnswer('q1', 'a1', 1000);
      }).toThrow(SessionExpiredException);
    });
  });
});
```

### Integration Test Example

```typescript
// quiz/application/commands/start-quiz.handler.integration.spec.ts
describe('StartQuizHandler (Integration)', () => {
  let handler: StartQuizHandler;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, QuizModule],
    }).compile();

    handler = module.get(StartQuizHandler);
    prisma = module.get(PrismaService);
  });

  it('should start quiz and save to database', async () => {
    // Arrange
    const command = new StartQuizCommand('user-1', 'chocolat', 'commis');

    // Act
    const result = await handler.execute(command);

    // Assert
    const savedSession = await prisma.quizSession.findUnique({
      where: { id: result.sessionId },
    });
    expect(savedSession).toBeDefined();
    expect(savedSession.status).toBe('IN_PROGRESS');
  });
});
```

### E2E Test Example

```typescript
// test/e2e/quiz.e2e-spec.ts
describe('Quiz Flow (E2E)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    // Login
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Test123!' });
    authToken = response.body.data.token;
  });

  it('should complete full quiz flow', async () => {
    // Start quiz
    const startResponse = await request(app.getHttpServer())
      .post('/api/v1/quiz/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ difficulty: 'commis' })
      .expect(201);

    const sessionId = startResponse.body.data.sessionId;

    // Answer all questions
    for (let i = 0; i < 10; i++) {
      const question = startResponse.body.data.currentQuestion;
      await request(app.getHttpServer())
        .post(`/api/v1/quiz/${sessionId}/answer`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          questionId: question.questionId,
          answerId: question.answers[0].id,
          timeSpent: 5000,
        })
        .expect(200);
    }

    // Get result
    const resultResponse = await request(app.getHttpServer())
      .get(`/api/v1/quiz/${sessionId}/result`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(resultResponse.body.data.finalScore).toBeGreaterThan(0);
  });
});
```

---

## Key Architectural Decisions

### 1. Modular Monolith (not Microservices)

**Why?**
- Simpler deployment (single process)
- Easier development (no network calls between contexts)
- Lower operational complexity
- Can evolve to microservices later if needed

**How to maintain modularity?**
- Strict module boundaries
- No direct imports between contexts (use events)
- Each context has own database schema namespace

### 2. Event-Driven but Synchronous

**Why?**
- In-process EventEmitter for simplicity
- No message queue infrastructure needed for MVP
- Predictable execution flow
- Easy debugging

**Migration path:**
- Can switch to async message queue (RabbitMQ, Kafka) later
- Event structure already designed for eventual consistency

### 3. CQRS without Event Sourcing

**Why?**
- Commands and Queries separated for clarity
- No full event sourcing (simpler for MVP)
- Event store table exists for audit/analytics but not primary storage

**When to add Event Sourcing?**
- If audit requirements become critical
- If need to replay history
- If complex temporal queries needed

### 4. Repository Pattern over Active Record

**Why?**
- Domain layer remains pure (no Prisma imports)
- Testability (easy to mock repositories)
- Flexibility to change ORM later
- Follows DDD principles

### 5. Vertical Slice per Context

**Why?**
- Each context is self-contained
- Team can own entire slice (domain → API)
- Easy to extract to microservice later
- Reduces coupling

---

## Performance Considerations

### Caching Strategy

```typescript
// infrastructure/cache/leaderboard.cache.ts
@Injectable()
export class LeaderboardCache {
  constructor(private readonly redis: RedisService) {}

  async getWeeklyTop100(): Promise<RankingDto[] | null> {
    const cached = await this.redis.get('leaderboard:weekly:top100');
    return cached ? JSON.parse(cached) : null;
  }

  async setWeeklyTop100(rankings: RankingDto[]): Promise<void> {
    await this.redis.setex(
      'leaderboard:weekly:top100',
      300, // 5 minutes TTL
      JSON.stringify(rankings),
    );
  }
}
```

### Database Indexing

All critical indexes are defined in Prisma schema:
- `User.email` (unique)
- `QuizSession.userId + status`
- `PlayerRanking.globalScore` (for leaderboard queries)
- `Transaction.userId + createdAt` (for history)

### Pagination

```typescript
// shared/utils/pagination.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function paginate<T>(
  query: any,
  params: PaginationParams,
): Promise<PaginatedResult<T>> {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    query.skip(skip).take(limit),
    query.count(),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

---

## Security Architecture

### JWT Strategy

```typescript
// identity/infrastructure/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepo: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    const user = await this.userRepo.findById(payload.sub);
    if (!user) throw new UnauthorizedException();

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
```

### Role Guard

```typescript
// shared/presentation/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    return requiredRoles.includes(user.role);
  }
}

// Usage
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Post('questions')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async createQuestion(@Body() dto: CreateQuestionDto) {
    // ...
  }
}
```

### Rate Limiting

```typescript
// shared/presentation/guards/rate-limit.guard.ts
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId || request.ip;
    const endpoint = request.route.path;

    const key = `ratelimit:${endpoint}:${userId}`;
    const limit = this.getLimitForEndpoint(endpoint);
    const window = 60; // 1 minute

    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, window);
    }

    if (current > limit) {
      throw new TooManyRequestsException();
    }

    return true;
  }

  private getLimitForEndpoint(endpoint: string): number {
    const limits: Record<string, number> = {
      '/api/v1/auth/login': 5,
      '/api/v1/auth/register': 3,
      '/api/v1/quiz/start': 10,
    };
    return limits[endpoint] || 100;
  }
}
```

---

## Next Steps

After understanding this architecture:

1. ✅ **Folder structure created**
2. ⏳ **Generate initial modules** (`nest g module modules/identity`)
3. ⏳ **Implement Identity context** (auth + user management)
4. ⏳ **Implement Quiz context** (core functionality)
5. ⏳ **Implement event handlers** (cross-context communication)
6. ⏳ **Add background jobs** (lives regen, leaderboard reset)
7. ⏳ **Write tests** (unit → integration → e2e)
8. ⏳ **Deploy MVP**

---

## References

- [NestJS Documentation](https://docs.nestjs.com)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

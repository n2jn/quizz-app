# 📢 Event-Driven Architecture

This document specifies how domain events flow between bounded contexts using NestJS EventEmitter.

---

## Event Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Event Flow                              │
│                                                                 │
│  Quiz Context                                                   │
│     │                                                            │
│     ├─ QuizCompleted ────────┬──────────┬──────────────┐        │
│     │                        │          │              │        │
│     │                        ▼          ▼              ▼        │
│     │                   Gamification  Economy    Leaderboard    │
│     │                        │          │                       │
│     │                        │          │                       │
│     ├─ PerfectScore ─────────┼──────────┤                       │
│     │                        │          │                       │
│     │                        ▼          ▼                       │
│                         BadgeUnlocked  CoinsEarned              │
│                              │          │                       │
│                              └──────────┘                       │
│                                   │                             │
│                                   ▼                             │
│                              More Coins                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Event Catalog

### 1. Identity Context Events

#### UserRegistered
```typescript
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly username: string,
  ) {
    super();
  }
}
```

**Emitted by:** `User` aggregate
**Consumed by:**
- Gamification (create PlayerProgress)
- Economy (create Wallet + Lives)
- Leaderboard (create PlayerRanking)

**Handlers:**
```typescript
// gamification/application/event-handlers/user-registered.handler.ts
@EventHandler(UserRegisteredEvent)
export class UserRegisteredGamificationHandler {
  @OnEvent(UserRegisteredEvent.name)
  async handle(event: UserRegisteredEvent): Promise<void> {
    const progress = PlayerProgress.create(event.userId);
    await this.progressRepo.save(progress);
  }
}

// economy/application/event-handlers/user-registered.handler.ts
@EventHandler(UserRegisteredEvent)
export class UserRegisteredEconomyHandler {
  @OnEvent(UserRegisteredEvent.name)
  async handle(event: UserRegisteredEvent): Promise<void> {
    const wallet = Wallet.create(event.userId, 0);
    const lives = Lives.create(event.userId, 5);

    await this.walletRepo.save(wallet);
    await this.livesRepo.save(lives);
  }
}
```

---

### 2. Quiz Context Events

#### QuizStartedEvent
```typescript
export class QuizStartedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly categoryId: string,
    public readonly difficulty: string,
    public readonly startedAt: Date,
  ) {
    super();
  }
}
```

**Emitted by:** `QuizSession.start()`
**Consumed by:**
- Economy (consume 1 life)

**Handler:**
```typescript
// economy/application/event-handlers/quiz-started.handler.ts
@EventHandler(QuizStartedEvent)
export class QuizStartedHandler {
  @OnEvent(QuizStartedEvent.name)
  async handle(event: QuizStartedEvent): Promise<void> {
    const lives = await this.livesRepo.findByUserId(event.userId);
    lives.consumeLife();
    await this.livesRepo.save(lives);
    this.eventBus.publishAll(lives.events);
  }
}
```

---

#### QuestionAnsweredEvent
```typescript
export class QuestionAnsweredEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly questionId: string,
    public readonly isCorrect: boolean,
    public readonly pointsEarned: number,
    public readonly timeSpent: number,
  ) {
    super();
  }
}
```

**Emitted by:** `QuizSession.submitAnswer()`
**Consumed by:** (Optional logging/analytics)

---

#### QuizCompletedEvent
```typescript
export class QuizCompletedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly finalScore: number,
    public readonly correctAnswers: number,
    public readonly totalQuestions: number,
    public readonly categoryId: string,
    public readonly difficulty: string,
    public readonly completedAt: Date,
  ) {
    super();
  }
}
```

**Emitted by:** `QuizSession.complete()`
**Consumed by:**
- Gamification (add XP, update streak, check badges)
- Economy (award 10 coins)
- Leaderboard (update ranking)

**Handlers:**
```typescript
// gamification/application/event-handlers/quiz-completed.handler.ts
@EventHandler(QuizCompletedEvent)
export class QuizCompletedGamificationHandler implements IEventHandler<QuizCompletedEvent> {
  constructor(
    private readonly progressRepo: IPlayerProgressRepository,
    private readonly xpCalculator: ExperienceCalculator,
    private readonly badgeEvaluator: BadgeEvaluator,
    private readonly eventBus: EventBus,
  ) {}

  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    const progress = await this.progressRepo.findByUserId(event.userId);

    // Add XP
    const xpEarned = this.xpCalculator.calculateXP(
      event.finalScore,
      event.difficulty,
      progress.currentStreak,
    );
    progress.addExperience(xpEarned);

    // Update streak
    progress.updateStreak();

    // Update stats
    progress.updateStats(
      event.categoryId,
      event.correctAnswers,
      event.totalQuestions,
      event.finalScore === event.totalQuestions * 100, // isPerfect
    );

    await this.progressRepo.save(progress);
    this.eventBus.publishAll(progress.events);

    // Check badges asynchronously
    const newBadges = await this.badgeEvaluator.evaluateBadges(event.userId);
    for (const badge of newBadges) {
      progress.unlockBadge(badge);
      await this.progressRepo.save(progress);
      this.eventBus.publish(new BadgeUnlockedEvent(event.userId, badge.id, badge.rarity));
    }
  }
}

// economy/application/event-handlers/quiz-completed.handler.ts
@EventHandler(QuizCompletedEvent)
export class QuizCompletedEconomyHandler {
  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(10, 'quiz_completed', `Quiz completed with score ${event.finalScore}`);
    await this.walletRepo.save(wallet);
    this.eventBus.publishAll(wallet.events);
  }
}

// leaderboard/application/event-handlers/quiz-completed.handler.ts
@EventHandler(QuizCompletedEvent)
export class QuizCompletedLeaderboardHandler {
  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    const ranking = await this.rankingRepo.findByUserId(event.userId);
    ranking.addScore(event.finalScore);
    await this.rankingRepo.save(ranking);
    this.eventBus.publishAll(ranking.events);
  }
}
```

---

#### PerfectScoreAchievedEvent
```typescript
export class PerfectScoreAchievedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly difficulty: string,
  ) {
    super();
  }
}
```

**Emitted by:** `QuizSession.complete()` (when 10/10)
**Consumed by:**
- Economy (award 50 bonus coins)
- Gamification (check for perfect-score badges)

**Handlers:**
```typescript
// economy/application/event-handlers/perfect-score.handler.ts
@EventHandler(PerfectScoreAchievedEvent)
export class PerfectScoreEconomyHandler {
  @OnEvent(PerfectScoreAchievedEvent.name)
  async handle(event: PerfectScoreAchievedEvent): Promise<void> {
    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(50, 'perfect_score', `Perfect score in ${event.difficulty}`);
    await this.walletRepo.save(wallet);
  }
}
```

---

#### QuizAbandonedEvent
```typescript
export class QuizAbandonedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly reason: 'user_action' | 'expired',
  ) {
    super();
  }
}
```

**Emitted by:** `QuizSession.abandon()`
**Consumed by:** (Analytics only, no business logic)

---

### 3. Gamification Context Events

#### ExperienceGainedEvent
```typescript
export class ExperienceGainedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly newTotal: number,
  ) {
    super();
  }
}
```

**Emitted by:** `PlayerProgress.addExperience()`
**Consumed by:** (Analytics/UI updates)

---

#### LevelUpEvent
```typescript
export class LevelUpEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly oldLevel: number,
    public readonly newLevel: number,
  ) {
    super();
  }
}
```

**Emitted by:** `PlayerProgress.addExperience()` (when threshold crossed)
**Consumed by:**
- Economy (award 100 coins)

**Handler:**
```typescript
// economy/application/event-handlers/level-up.handler.ts
@EventHandler(LevelUpEvent)
export class LevelUpEconomyHandler {
  @OnEvent(LevelUpEvent.name)
  async handle(event: LevelUpEvent): Promise<void> {
    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(100, 'level_up', `Reached level ${event.newLevel}`);
    await this.walletRepo.save(wallet);
  }
}
```

---

#### BadgeUnlockedEvent
```typescript
export class BadgeUnlockedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly badgeId: string,
    public readonly rarity: BadgeRarity,
  ) {
    super();
  }
}
```

**Emitted by:** `PlayerProgress.unlockBadge()`
**Consumed by:**
- Economy (award coins based on rarity)

**Handler:**
```typescript
// economy/application/event-handlers/badge-unlocked.handler.ts
@EventHandler(BadgeUnlockedEvent)
export class BadgeUnlockedEconomyHandler {
  @OnEvent(BadgeUnlockedEvent.name)
  async handle(event: BadgeUnlockedEvent): Promise<void> {
    const badge = await this.badgeRepo.findById(event.badgeId);
    const wallet = await this.walletRepo.findByUserId(event.userId);

    wallet.addCoins(badge.coinReward, 'badge_unlocked', `Unlocked ${badge.name}`);
    await this.walletRepo.save(wallet);
  }
}
```

---

#### StreakIncrementedEvent
```typescript
export class StreakIncrementedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly newStreak: number,
  ) {
    super();
  }
}
```

**Emitted by:** `PlayerProgress.updateStreak()`
**Consumed by:** (Analytics)

---

#### StreakLostEvent
```typescript
export class StreakLostEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly previousStreak: number,
  ) {
    super();
  }
}
```

**Emitted by:** `PlayerProgress.resetStreak()` or cron job
**Consumed by:** (Notifications/Analytics)

---

#### StreakMilestoneEvent
```typescript
export class StreakMilestoneEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly days: number, // 7, 30, 100, 365
  ) {
    super();
  }
}
```

**Emitted by:** `PlayerProgress.updateStreak()` (when hitting milestone)
**Consumed by:**
- Economy (award coins: 100/500/2000/10000)

**Handler:**
```typescript
// economy/application/event-handlers/streak-milestone.handler.ts
@EventHandler(StreakMilestoneEvent)
export class StreakMilestoneEconomyHandler {
  private readonly REWARDS: Record<number, number> = {
    7: 100,
    30: 500,
    100: 2000,
    365: 10000,
  };

  @OnEvent(StreakMilestoneEvent.name)
  async handle(event: StreakMilestoneEvent): Promise<void> {
    const reward = this.REWARDS[event.days];
    if (!reward) return;

    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(reward, 'streak_milestone', `${event.days}-day streak`);
    await this.walletRepo.save(wallet);
  }
}
```

---

### 4. Economy Context Events

#### CoinsEarnedEvent
```typescript
export class CoinsEarnedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly source: string,
  ) {
    super();
  }
}
```

**Emitted by:** `Wallet.addCoins()`
**Consumed by:** (Analytics/UI updates)

---

#### CoinsSpentEvent
```typescript
export class CoinsSpentEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly itemId: string,
  ) {
    super();
  }
}
```

**Emitted by:** `Wallet.spendCoins()`
**Consumed by:** (Analytics)

---

#### LifeConsumedEvent
```typescript
export class LifeConsumedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly remainingLives: number,
  ) {
    super();
  }
}
```

**Emitted by:** `Lives.consumeLife()`
**Consumed by:** (UI updates)

---

#### LifeRegeneratedEvent
```typescript
export class LifeRegeneratedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly newTotal: number,
  ) {
    super();
  }
}
```

**Emitted by:** `Lives.regenerateLives()` (cron job)
**Consumed by:** (UI updates)

---

### 5. Leaderboard Context Events

#### RankingUpdatedEvent
```typescript
export class RankingUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly globalRank: number,
    public readonly weeklyRank: number,
  ) {
    super();
  }
}
```

**Emitted by:** Leaderboard recalculation (cron job)
**Consumed by:** (Notifications if rank improved significantly)

---

#### TopTenEnteredEvent
```typescript
export class TopTenEnteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly rank: number,
    public readonly leaderboardType: 'global' | 'weekly',
  ) {
    super();
  }
}
```

**Emitted by:** Leaderboard recalculation
**Consumed by:** (Push notification)

---

### 6. Content Context Events

#### QuestionPublishedEvent
```typescript
export class QuestionPublishedEvent extends DomainEvent {
  constructor(
    public readonly questionId: string,
    public readonly categoryId: string,
    public readonly difficulty: string,
  ) {
    super();
  }
}
```

**Emitted by:** Question approval workflow
**Consumed by:** (Cache invalidation)

---

## Event Bus Implementation

### Setup

```typescript
// app.module.ts
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20, // Increase if many handlers per event
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
  ],
})
export class AppModule {}
```

### Event Bus Service

```typescript
// shared/infrastructure/events/event-bus.service.ts
@Injectable()
export class EventBus {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: LoggerService,
  ) {}

  publish<T extends DomainEvent>(event: T): void {
    const eventName = event.constructor.name;
    this.logger.debug(`Publishing event: ${eventName}`, event);

    try {
      this.eventEmitter.emit(eventName, event);
    } catch (error) {
      this.logger.error(`Error publishing event ${eventName}`, error);
      throw error;
    }
  }

  publishAll(events: DomainEvent[]): void {
    events.forEach(event => this.publish(event));
  }
}
```

### Base Domain Event

```typescript
// shared/domain/events/domain-event.base.ts
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = uuid();
  }

  abstract get aggregateId(): string;
}
```

### Event Handler Decorator

```typescript
// shared/domain/events/event-handler.decorator.ts
export const EventHandler = (event: Type<DomainEvent>): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata('EVENT_HANDLER', event, target);
    Injectable()(target);
  };
};
```

### Event Handler Interface

```typescript
// shared/domain/events/event-handler.interface.ts
export interface IEventHandler<T extends DomainEvent = any> {
  handle(event: T): Promise<void>;
}
```

---

## Event Ordering and Consistency

### Synchronous Event Handling (Current)

Events are handled **synchronously** in the same process using NestJS EventEmitter.

**Pros:**
- Immediate consistency
- Predictable execution order
- Easy debugging
- No message queue infrastructure

**Cons:**
- Single point of failure (if handler crashes, event is lost)
- Performance: handlers block each other
- No retry mechanism

**Example Flow:**
```typescript
// 1. Complete quiz
session.complete();

// 2. Save session
await sessionRepo.save(session);

// 3. Publish events (synchronous)
eventBus.publishAll(session.events);
  ↓
  QuizCompletedEvent → GamificationHandler (blocks)
  ↓
  LevelUpEvent → EconomyHandler (blocks)
  ↓
  Done
```

---

### Event Persistence (Recommended for Production)

Store events in database before/after handling for audit trail.

```typescript
// shared/infrastructure/events/event-store.service.ts
@Injectable()
export class EventStore {
  constructor(private readonly prisma: PrismaService) {}

  async append(event: DomainEvent): Promise<void> {
    await this.prisma.domainEvent.create({
      data: {
        aggregateId: event.aggregateId,
        aggregateType: event.constructor.name.replace('Event', ''),
        eventType: event.constructor.name,
        eventData: JSON.stringify(event),
        createdAt: event.occurredOn,
      },
    });
  }

  async getEventsByAggregate(aggregateId: string): Promise<DomainEvent[]> {
    const events = await this.prisma.domainEvent.findMany({
      where: { aggregateId },
      orderBy: { createdAt: 'asc' },
    });

    return events.map(e => this.deserialize(e));
  }

  private deserialize(record: any): DomainEvent {
    // Reconstruct event from JSON
    const EventClass = this.getEventClass(record.eventType);
    return Object.assign(new EventClass(), JSON.parse(record.eventData));
  }
}
```

**Enhanced EventBus with persistence:**
```typescript
@Injectable()
export class EventBus {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly eventStore: EventStore,
    private readonly logger: LoggerService,
  ) {}

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const eventName = event.constructor.name;

    // 1. Store event first
    await this.eventStore.append(event);

    // 2. Publish to handlers
    try {
      this.eventEmitter.emit(eventName, event);
    } catch (error) {
      this.logger.error(`Error handling event ${eventName}`, error);
      // Event is stored, can be replayed later
      throw error;
    }
  }
}
```

---

## Error Handling in Event Handlers

### Strategy 1: Fail Fast (Current)
```typescript
@EventHandler(QuizCompletedEvent)
export class QuizCompletedHandler {
  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    // If this fails, entire request fails
    const progress = await this.progressRepo.findByUserId(event.userId);
    progress.addExperience(event.xpEarned);
    await this.progressRepo.save(progress);
  }
}
```

### Strategy 2: Try-Catch with Logging (Recommended)
```typescript
@EventHandler(QuizCompletedEvent)
export class QuizCompletedHandler {
  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    try {
      const progress = await this.progressRepo.findByUserId(event.userId);
      progress.addExperience(event.xpEarned);
      await this.progressRepo.save(progress);
    } catch (error) {
      this.logger.error(
        `Failed to handle QuizCompletedEvent for user ${event.userId}`,
        error,
      );
      // Optionally: queue for retry
      await this.retryQueue.add({ event, attempt: 1 });
    }
  }
}
```

### Strategy 3: Dead Letter Queue (Future)
```typescript
@EventHandler(QuizCompletedEvent)
export class QuizCompletedHandler {
  @OnEvent(QuizCompletedEvent.name)
  async handle(event: QuizCompletedEvent): Promise<void> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        // Handle event
        return;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          // Send to dead letter queue
          await this.deadLetterQueue.add(event, error);
          throw error;
        }
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }
  }
}
```

---

## Event Payload Best Practices

### ✅ Good: Include essential data
```typescript
export class QuizCompletedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly finalScore: number,
    public readonly correctAnswers: number,
    public readonly categoryId: string,
    public readonly difficulty: string,
  ) {
    super();
  }
}
```

### ❌ Bad: Include entire aggregates
```typescript
export class QuizCompletedEvent extends DomainEvent {
  constructor(
    public readonly session: QuizSession, // ❌ Too much data
    public readonly user: User,            // ❌ Unnecessary
  ) {
    super();
  }
}
```

### ✅ Good: Handlers fetch what they need
```typescript
@EventHandler(QuizCompletedEvent)
export class QuizCompletedHandler {
  async handle(event: QuizCompletedEvent): Promise<void> {
    // Fetch only what's needed
    const progress = await this.progressRepo.findByUserId(event.userId);
    // ...
  }
}
```

---

## Testing Event Handlers

### Unit Test (Mocked Dependencies)
```typescript
describe('QuizCompletedGamificationHandler', () => {
  let handler: QuizCompletedGamificationHandler;
  let mockProgressRepo: jest.Mocked<IPlayerProgressRepository>;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    mockProgressRepo = {
      findByUserId: jest.fn(),
      save: jest.fn(),
    } as any;

    mockEventBus = {
      publishAll: jest.fn(),
    } as any;

    handler = new QuizCompletedGamificationHandler(
      mockProgressRepo,
      new ExperienceCalculator(),
      mockEventBus,
    );
  });

  it('should add XP when quiz completed', async () => {
    // Arrange
    const event = new QuizCompletedEvent('session-1', 'user-1', 1000, 10, 10);
    const progress = PlayerProgressTestFactory.create();
    mockProgressRepo.findByUserId.mockResolvedValue(progress);

    // Act
    await handler.handle(event);

    // Assert
    expect(mockProgressRepo.save).toHaveBeenCalledWith(progress);
    expect(progress.currentXP).toBeGreaterThan(0);
  });
});
```

### Integration Test (Real Event Flow)
```typescript
describe('Quiz Completion Event Flow (Integration)', () => {
  let app: INestApplication;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    eventBus = module.get(EventBus);
  });

  it('should trigger all handlers when quiz completed', async () => {
    // Arrange
    const userId = 'test-user';
    const event = new QuizCompletedEvent('session-1', userId, 1000, 10, 10);

    // Act
    await eventBus.publish(event);

    // Assert - check side effects
    const progress = await prisma.playerProgress.findUnique({
      where: { userId },
    });
    expect(progress.currentXP).toBeGreaterThan(0);

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });
    expect(wallet.balance).toBeGreaterThanOrEqual(10);
  });
});
```

---

## Migration Path: Async Message Queue (Future)

When the system grows, migrate to async message queue (RabbitMQ, Kafka, AWS SQS).

### Current (Synchronous):
```typescript
eventBus.publish(new QuizCompletedEvent(...));
// Blocks until all handlers complete
```

### Future (Asynchronous):
```typescript
await messageQueue.publish('quiz.completed', {
  sessionId: '...',
  userId: '...',
  // ...
});
// Returns immediately, handlers process in background
```

**Benefits:**
- Resilience (retry failed handlers)
- Scalability (horizontal scaling)
- Decoupling (contexts can be separate services)

**Trade-offs:**
- Eventual consistency (not immediate)
- More complex infrastructure
- Harder to debug

---

## Summary: Event Handler Checklist

When creating a new event handler:

1. ✅ Add `@EventHandler(EventClass)` decorator
2. ✅ Implement `IEventHandler<EventClass>`
3. ✅ Add `@OnEvent(EventClass.name)` to handler method
4. ✅ Use try-catch for error handling
5. ✅ Log errors with context
6. ✅ Keep handler focused (single responsibility)
7. ✅ Avoid circular event chains
8. ✅ Test handler in isolation (unit test)
9. ✅ Test full event flow (integration test)
10. ✅ Document what events are consumed and emitted

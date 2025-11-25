# ⚖️ Business Rules Implementation Guide

This document maps business rules from `01-Domain-Discovery/Regles-Metier.md` to concrete technical implementation specifications.

---

## 1. Quiz Session Rules

### Rule: Quiz contains exactly 10 questions

**Where:** `QuizSession` aggregate
**Implementation:**
```typescript
class QuizSession {
  private readonly QUESTIONS_PER_QUIZ = 10;

  static start(userId: string, questions: Question[]): QuizSession {
    if (questions.length !== this.QUESTIONS_PER_QUIZ) {
      throw new InvalidQuestionCountException(
        `Expected ${this.QUESTIONS_PER_QUIZ}, got ${questions.length}`
      );
    }
    // ...
  }
}
```

**Validation:**
- Enforce in `StartQuizHandler` before creating aggregate
- Question selection service must return exactly 10 questions

---

### Rule: Session expires after 10 minutes of inactivity

**Where:** `QuizSession` aggregate
**Implementation:**
```typescript
class QuizSession {
  private readonly SESSION_TIMEOUT_MINUTES = 10;

  static start(...): QuizSession {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return new QuizSession(..., expiresAt);
  }

  submitAnswer(...): void {
    if (this.hasExpired()) {
      this.status = SessionStatus.ABANDONED;
      this.addDomainEvent(new QuizAbandonedEvent(this.id, this.userId, 'expired'));
      throw new SessionExpiredException('Quiz session has expired');
    }
    // ...
  }

  private hasExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
```

**Cron Job:** Clean up expired sessions
```typescript
// cron/jobs/session-cleanup.job.ts
@Cron('*/5 * * * *') // Every 5 minutes
async cleanupExpiredSessions() {
  const expiredSessions = await this.sessionRepo.findExpired();

  for (const session of expiredSessions) {
    session.abandon('expired');
    await this.sessionRepo.save(session);
    this.eventBus.publish(new QuizAbandonedEvent(...));
  }
}
```

---

### Rule: No going back once answered

**Where:** `QuizSession` aggregate
**Implementation:**
```typescript
class QuizSession {
  submitAnswer(questionId: string, answerId: string): void {
    // Check if already answered
    const existingAnswer = this.answers.find(a => a.questionId === questionId);
    if (existingAnswer) {
      throw new QuestionAlreadyAnsweredException(
        `Question ${questionId} has already been answered`
      );
    }
    // ...
  }
}
```

**Database:** Unique constraint
```prisma
model SessionAnswer {
  @@unique([sessionId, questionId])
}
```

---

## 2. Scoring Rules

### Rule: Base Points + Time Bonus

**Formula from Regles-Metier.md:**
- Correct answer: 100 base points
- Time bonus: +10 points per second remaining (max +300)
- Wrong answer: 0 points

**Where:** `ScoringService` (domain service)
**Implementation:**
```typescript
@Injectable()
export class ScoringService {
  private readonly BASE_POINTS = 100;
  private readonly TIME_BONUS_PER_SECOND = 10;
  private readonly MAX_TIME_BONUS = 300;

  calculatePoints(
    isCorrect: boolean,
    timeSpent: number,
    timeLimit: number,
  ): { basePoints: number; timeBonus: number; total: number } {
    if (!isCorrect) {
      return { basePoints: 0, timeBonus: 0, total: 0 };
    }

    const basePoints = this.BASE_POINTS;
    const remainingTime = Math.max(0, timeLimit - timeSpent);
    const timeBonus = Math.min(
      this.MAX_TIME_BONUS,
      Math.floor(remainingTime * this.TIME_BONUS_PER_SECOND)
    );

    return {
      basePoints,
      timeBonus,
      total: basePoints + timeBonus,
    };
  }
}
```

**Usage in QuizSession:**
```typescript
class QuizSession {
  constructor(private readonly scoringService: ScoringService) {}

  submitAnswer(questionId: string, answerId: string, timeSpent: number): void {
    const question = this.findQuestion(questionId);
    const isCorrect = question.validateAnswer(answerId);

    const { basePoints, timeBonus, total } = this.scoringService.calculatePoints(
      isCorrect,
      timeSpent,
      question.timeLimit,
    );

    const answer = new SessionAnswer(
      questionId,
      answerId,
      isCorrect,
      timeSpent,
      basePoints,
      timeBonus,
    );

    this.answers.push(answer);
    this.score = this.score.add(total);

    // Event
    this.addDomainEvent(new QuestionAnsweredEvent(
      this.id,
      this.userId,
      questionId,
      isCorrect,
      total,
    ));
  }
}
```

---

### Rule: Perfect Score Bonus (x1.5)

**Where:** `QuizSession` aggregate
**Implementation:**
```typescript
class QuizSession {
  complete(): void {
    this.status = SessionStatus.COMPLETED;
    this.completedAt = new Date();

    let finalScore = this.score.value;

    // Perfect score bonus
    if (this.isPerfectScore()) {
      finalScore = Math.floor(finalScore * 1.5);
      this.score = new Score(finalScore);

      this.addDomainEvent(new PerfectScoreAchievedEvent(
        this.id,
        this.userId,
        this.difficulty.level,
      ));
    }

    this.addDomainEvent(new QuizCompletedEvent(
      this.id,
      this.userId,
      finalScore,
      this.correctAnswersCount(),
      this.questions.length,
    ));
  }

  private isPerfectScore(): boolean {
    return this.correctAnswersCount() === this.questions.length;
  }

  private correctAnswersCount(): number {
    return this.answers.filter(a => a.isCorrect).length;
  }
}
```

---

## 3. Difficulty Rules

### Rule: Time and XP multiplier per difficulty

**Where:** `Difficulty` value object
**Implementation:**
```typescript
export class Difficulty extends ValueObject {
  private static readonly CONFIGS = {
    apprenti: { timePerQuestion: 45, xpMultiplier: 1.0 },
    commis: { timePerQuestion: 30, xpMultiplier: 1.5 },
    chef: { timePerQuestion: 20, xpMultiplier: 2.0 },
    mof: { timePerQuestion: 15, xpMultiplier: 3.0 },
  };

  constructor(public readonly level: DifficultyLevel) {
    super();
    if (!Difficulty.CONFIGS[level]) {
      throw new InvalidDifficultyException(`Unknown difficulty: ${level}`);
    }
  }

  get timePerQuestion(): number {
    return Difficulty.CONFIGS[this.level].timePerQuestion;
  }

  get xpMultiplier(): number {
    return Difficulty.CONFIGS[this.level].xpMultiplier;
  }

  protected getEqualityComponents(): any[] {
    return [this.level];
  }
}
```

**Seeded in Database:**
```typescript
// prisma/seed.ts
const difficulties = [
  { level: 'apprenti', name: 'Apprenti', timePerQuestion: 45, xpMultiplier: 1.0 },
  { level: 'commis', name: 'Commis', timePerQuestion: 30, xpMultiplier: 1.5 },
  { level: 'chef', name: 'Chef', timePerQuestion: 20, xpMultiplier: 2.0 },
  { level: 'mof', name: 'MOF', timePerQuestion: 15, xpMultiplier: 3.0 },
];
```

---

## 4. XP and Level Rules

### Rule: XP Calculation with Streak Bonus

**Formula:**
```
XP = ScoreQuiz × MultiplierDifficulté × StreakBonus
```

**Streak Bonus Table:**
| Streak Days | Bonus |
|-------------|-------|
| 1-6         | x1.0  |
| 7-13        | x1.1  |
| 14-29       | x1.25 |
| 30+         | x1.5  |

**Where:** `GamificationService` or `ExperienceCalculator`
**Implementation:**
```typescript
@Injectable()
export class ExperienceCalculator {
  calculateXP(
    quizScore: number,
    difficulty: Difficulty,
    currentStreak: number,
  ): number {
    const difficultyMultiplier = difficulty.xpMultiplier;
    const streakBonus = this.getStreakBonus(currentStreak);

    return Math.floor(quizScore * difficultyMultiplier * streakBonus);
  }

  private getStreakBonus(streakDays: number): number {
    if (streakDays >= 30) return 1.5;
    if (streakDays >= 14) return 1.25;
    if (streakDays >= 7) return 1.1;
    return 1.0;
  }
}
```

**Event Handler:**
```typescript
@EventHandler(QuizCompletedEvent)
export class QuizCompletedHandler {
  constructor(
    private readonly xpCalculator: ExperienceCalculator,
    private readonly progressRepo: IPlayerProgressRepository,
  ) {}

  async handle(event: QuizCompletedEvent): Promise<void> {
    const progress = await this.progressRepo.findByUserId(event.userId);

    const xpEarned = this.xpCalculator.calculateXP(
      event.finalScore,
      event.difficulty,
      progress.currentStreak,
    );

    progress.addExperience(xpEarned);

    await this.progressRepo.save(progress);
    this.eventBus.publishAll(progress.events);
  }
}
```

---

### Rule: Level Formula

**Formula:**
```
XP_requis(n) = 250 × n × (n + 1)
```

**Where:** `LevelCalculator` domain service
**Implementation:**
```typescript
@Injectable()
export class LevelCalculator {
  calculateLevel(totalXP: number): number {
    let level = 1;
    while (this.xpRequiredForLevel(level + 1) <= totalXP) {
      level++;
    }
    return level;
  }

  xpRequiredForLevel(level: number): number {
    return 250 * level * (level + 1);
  }

  xpForNextLevel(currentLevel: number): number {
    return this.xpRequiredForLevel(currentLevel + 1);
  }

  progressToNextLevel(currentXP: number, currentLevel: number): number {
    const xpForCurrentLevel = this.xpRequiredForLevel(currentLevel);
    const xpForNextLevel = this.xpRequiredForLevel(currentLevel + 1);
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

    return Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
  }
}
```

**Usage in PlayerProgress:**
```typescript
class PlayerProgress extends AggregateRoot {
  constructor(
    private levelCalculator: LevelCalculator,
    private currentXP: number,
    private currentLevel: number,
  ) {
    super();
  }

  addExperience(xp: number): void {
    const oldLevel = this.currentLevel;
    this.currentXP += xp;

    this.addDomainEvent(new ExperienceGainedEvent(this.userId, xp, this.currentXP));

    // Check for level up
    const newLevel = this.levelCalculator.calculateLevel(this.currentXP);

    if (newLevel > oldLevel) {
      this.currentLevel = newLevel;
      this.addDomainEvent(new LevelUpEvent(this.userId, oldLevel, newLevel));
    }
  }
}
```

---

## 5. Streak Rules

### Rule: Streak Reset at Midnight

**Where:** Cron job + `StreakCalculator`
**Implementation:**

**Domain Service:**
```typescript
@Injectable()
export class StreakCalculator {
  hasPlayedToday(lastPlayedAt: Date): boolean {
    const today = this.startOfDay(new Date());
    const lastPlayed = this.startOfDay(lastPlayedAt);

    return today.getTime() === lastPlayed.getTime();
  }

  shouldIncrementStreak(lastPlayedAt: Date): boolean {
    const yesterday = this.startOfDay(this.subtractDays(new Date(), 1));
    const lastPlayed = this.startOfDay(lastPlayedAt);

    return yesterday.getTime() === lastPlayed.getTime();
  }

  shouldResetStreak(lastPlayedAt: Date, hasProtection: boolean): boolean {
    if (hasProtection) return false;

    const yesterday = this.startOfDay(this.subtractDays(new Date(), 1));
    const lastPlayed = this.startOfDay(lastPlayedAt);

    return lastPlayed.getTime() < yesterday.getTime();
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private subtractDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
  }
}
```

**Cron Job:**
```typescript
// cron/jobs/streak-update.job.ts
@Injectable()
export class StreakUpdateJob {
  @Cron('0 0 * * *') // Daily at midnight
  async updateStreaks() {
    const allPlayers = await this.progressRepo.findAll();

    for (const progress of allPlayers) {
      const hasProtection = await this.hasActiveProtection(progress.userId);

      if (this.streakCalculator.shouldResetStreak(progress.lastPlayedAt, hasProtection)) {
        if (hasProtection) {
          // Consume protection instead of resetting
          await this.consumeProtection(progress.userId);
        } else {
          progress.resetStreak();
          await this.progressRepo.save(progress);
          this.eventBus.publish(new StreakLostEvent(progress.userId, progress.currentStreak));
        }
      }
    }
  }
}
```

**In PlayerProgress:**
```typescript
class PlayerProgress {
  updateStreak(): void {
    if (this.streakCalculator.hasPlayedToday(this.lastPlayedAt)) {
      // Already played today, do nothing
      return;
    }

    if (this.streakCalculator.shouldIncrementStreak(this.lastPlayedAt)) {
      // Played yesterday, increment
      this.currentStreak++;

      if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
      }

      this.addDomainEvent(new StreakIncrementedEvent(this.userId, this.currentStreak));

      // Check milestones
      this.checkStreakMilestone();
    } else {
      // Gap in streak, reset to 1
      const oldStreak = this.currentStreak;
      this.currentStreak = 1;

      if (oldStreak > 0) {
        this.addDomainEvent(new StreakLostEvent(this.userId, oldStreak));
      }
    }

    this.lastPlayedAt = new Date();
  }

  private checkStreakMilestone(): void {
    const milestones = [7, 30, 100, 365];

    if (milestones.includes(this.currentStreak)) {
      this.addDomainEvent(new StreakMilestoneEvent(
        this.userId,
        this.currentStreak,
      ));
    }
  }
}
```

---

### Rule: Streak Protection

**Business Rules:**
- Costs 200 coins
- Protects for 1 day
- Max 2 active protections
- Cannot be used retroactively

**Where:** `StreakProtection` entity + Economy context
**Implementation:**

**Purchase Handler:**
```typescript
@CommandHandler(PurchaseStreakProtectionCommand)
export class PurchaseStreakProtectionHandler {
  async execute(command: PurchaseStreakProtectionCommand): Promise<void> {
    // Check wallet
    const wallet = await this.walletRepo.findByUserId(command.userId);
    if (wallet.balance < 200) {
      throw new InsufficientCoinsException(200, wallet.balance);
    }

    // Check max protections
    const activeProtections = await this.protectionRepo.findActiveByUserId(command.userId);
    if (activeProtections.length >= 2) {
      throw new MaxProtectionsReachedException('Cannot have more than 2 active protections');
    }

    // Deduct coins
    wallet.spendCoins(200, 'streak_protection', 'Purchased streak protection');
    await this.walletRepo.save(wallet);

    // Create protection
    const protection = StreakProtection.create(
      command.userId,
      new Date(Date.now() + 24 * 60 * 60 * 1000), // +24 hours
    );
    await this.protectionRepo.save(protection);

    this.eventBus.publish(new StreakProtectionPurchasedEvent(command.userId));
  }
}
```

---

## 6. Economy Rules

### Rule: Wallet Balance Never Negative

**Where:** `Wallet` aggregate
**Implementation:**
```typescript
class Wallet extends AggregateRoot {
  private balance: number;

  spendCoins(amount: number, source: string, description: string): void {
    if (amount > this.balance) {
      throw new InsufficientCoinsException(amount, this.balance);
    }

    this.balance -= amount;
    this.lifetimeSpent += amount;

    const transaction = new Transaction(
      uuid(),
      this.userId,
      TransactionType.SPENT,
      amount,
      source,
      description,
      this.balance,
    );

    this.transactions.push(transaction);
    this.addDomainEvent(new CoinsSpentEvent(this.userId, amount, source));
  }

  addCoins(amount: number, source: string, description: string): void {
    if (amount <= 0) {
      throw new InvalidAmountException('Amount must be positive');
    }

    this.balance += amount;
    this.lifetimeEarned += amount;

    const transaction = new Transaction(
      uuid(),
      this.userId,
      TransactionType.EARNED,
      amount,
      source,
      description,
      this.balance,
    );

    this.transactions.push(transaction);
    this.addDomainEvent(new CoinsEarnedEvent(this.userId, amount, source));
  }
}
```

---

### Rule: Coin Rewards

**Where:** Event handlers in Economy context
**Implementation:**

```typescript
@EventHandler(QuizCompletedEvent)
export class QuizCompletedCoinsHandler {
  async handle(event: QuizCompletedEvent): Promise<void> {
    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(10, 'quiz_completed', `Quiz completed with score ${event.finalScore}`);
    await this.walletRepo.save(wallet);
  }
}

@EventHandler(PerfectScoreAchievedEvent)
export class PerfectScoreCoinsHandler {
  async handle(event: PerfectScoreAchievedEvent): Promise<void> {
    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(50, 'perfect_score', `Perfect score in ${event.difficulty} difficulty`);
    await this.walletRepo.save(wallet);
  }
}

@EventHandler(LevelUpEvent)
export class LevelUpCoinsHandler {
  async handle(event: LevelUpEvent): Promise<void> {
    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(100, 'level_up', `Reached level ${event.newLevel}`);
    await this.walletRepo.save(wallet);
  }
}

@EventHandler(BadgeUnlockedEvent)
export class BadgeUnlockedCoinsHandler {
  async handle(event: BadgeUnlockedEvent): Promise<void> {
    const badge = await this.badgeRepo.findById(event.badgeId);
    const wallet = await this.walletRepo.findByUserId(event.userId);

    wallet.addCoins(badge.coinReward, 'badge_unlocked', `Unlocked ${badge.name} badge`);
    await this.walletRepo.save(wallet);
  }
}

@EventHandler(StreakMilestoneEvent)
export class StreakMilestoneCoinsHandler {
  private readonly REWARDS = {
    7: 100,
    30: 500,
    100: 2000,
    365: 10000,
  };

  async handle(event: StreakMilestoneEvent): Promise<void> {
    const reward = this.REWARDS[event.days];
    if (!reward) return;

    const wallet = await this.walletRepo.findByUserId(event.userId);
    wallet.addCoins(reward, 'streak_milestone', `${event.days} day streak milestone`);
    await this.walletRepo.save(wallet);
  }
}
```

---

## 7. Lives Rules

### Rule: Lives System

**Parameters:**
- Max: 5 lives
- Regen: 1 life / 30 minutes
- Cost per quiz: 1 life
- Purchase: 300 coins = 1 life

**Where:** `Lives` aggregate
**Implementation:**

```typescript
class Lives extends AggregateRoot {
  private readonly MAX_LIVES = 5;
  private readonly REGEN_MINUTES = 30;

  private currentLives: number;
  private maxLives: number;
  private lastRegenAt: Date;

  consumeLife(): void {
    if (this.currentLives <= 0) {
      throw new InsufficientLivesException(1, this.currentLives);
    }

    this.currentLives--;

    if (this.currentLives < this.maxLives && !this.lastRegenAt) {
      this.lastRegenAt = new Date();
    }

    this.addDomainEvent(new LifeConsumedEvent(this.userId, this.currentLives));
  }

  addLife(): void {
    if (this.currentLives >= this.maxLives) {
      throw new MaxLivesReachedException('Already at maximum lives');
    }

    this.currentLives++;
    this.addDomainEvent(new LifeAddedEvent(this.userId, this.currentLives));
  }

  regenerateLives(): void {
    if (this.currentLives >= this.maxLives) {
      this.lastRegenAt = null;
      return;
    }

    if (!this.lastRegenAt) {
      this.lastRegenAt = new Date();
      return;
    }

    const now = new Date();
    const minutesPassed = (now.getTime() - this.lastRegenAt.getTime()) / (1000 * 60);
    const livesToRegen = Math.floor(minutesPassed / this.REGEN_MINUTES);

    if (livesToRegen > 0) {
      const newLives = Math.min(this.maxLives, this.currentLives + livesToRegen);
      const actuallyRegenerated = newLives - this.currentLives;

      if (actuallyRegenerated > 0) {
        this.currentLives = newLives;
        this.lastRegenAt = new Date(
          this.lastRegenAt.getTime() + (actuallyRegenerated * this.REGEN_MINUTES * 60 * 1000)
        );

        this.addDomainEvent(new LifeRegeneratedEvent(this.userId, this.currentLives));
      }

      if (this.currentLives >= this.maxLives) {
        this.lastRegenAt = null;
      }
    }
  }

  getNextRegenAt(): Date | null {
    if (this.currentLives >= this.maxLives || !this.lastRegenAt) {
      return null;
    }

    return new Date(this.lastRegenAt.getTime() + (this.REGEN_MINUTES * 60 * 1000));
  }
}
```

**Cron Job:**
```typescript
@Injectable()
export class LifeRegenJob {
  @Cron('*/5 * * * *') // Every 5 minutes
  async regenerateLives() {
    const allLives = await this.livesRepo.findAllNeedingRegen();

    for (const lives of allLives) {
      lives.regenerateLives();
      await this.livesRepo.save(lives);
      this.eventBus.publishAll(lives.events);
    }
  }
}
```

**Purchase Lives:**
```typescript
@CommandHandler(PurchaseLifeCommand)
export class PurchaseLifeHandler {
  async execute(command: PurchaseLifeCommand): Promise<void> {
    // Transaction to ensure atomicity
    await this.prisma.$transaction(async (tx) => {
      const wallet = await this.walletRepo.findByUserId(command.userId, tx);
      const lives = await this.livesRepo.findByUserId(command.userId, tx);

      // Check balance
      if (wallet.balance < 300) {
        throw new InsufficientCoinsException(300, wallet.balance);
      }

      // Check not at max
      if (lives.currentLives >= lives.maxLives) {
        throw new MaxLivesReachedException();
      }

      // Spend coins
      wallet.spendCoins(300, 'life_purchase', 'Purchased 1 life');

      // Add life
      lives.addLife();

      await this.walletRepo.save(wallet, tx);
      await this.livesRepo.save(lives, tx);
    });
  }
}
```

---

## 8. Badge Rules

### Rule: Badge Unlock Conditions

**Where:** `BadgeEvaluator` domain service
**Implementation:**

```typescript
@Injectable()
export class BadgeEvaluator {
  async evaluateBadges(userId: string): Promise<Badge[]> {
    const progress = await this.progressRepo.findByUserId(userId);
    const unlockedBadgeIds = progress.unlockedBadges.map(pb => pb.badgeId);
    const allBadges = await this.badgeRepo.findAll();

    const newlyUnlocked: Badge[] = [];

    for (const badge of allBadges) {
      if (unlockedBadgeIds.includes(badge.id)) continue;

      if (await this.meetsCondition(badge, progress)) {
        newlyUnlocked.push(badge);
      }
    }

    return newlyUnlocked;
  }

  private async meetsCondition(badge: Badge, progress: PlayerProgress): Promise<boolean> {
    const condition = badge.conditionData as BadgeCondition;

    switch (condition.type) {
      case 'quizzes_completed':
        return progress.totalQuizzes >= condition.count;

      case 'perfect_quizzes':
        return progress.perfectQuizzes >= condition.count;

      case 'streak':
        return progress.currentStreak >= condition.days;

      case 'level':
        return progress.currentLevel >= condition.value;

      case 'category_answers':
        const categoryStat = progress.categoryStats.find(
          cs => cs.categoryName === condition.category
        );
        return categoryStat && categoryStat.correctAnswers >= condition.count;

      case 'categories_played':
        return progress.categoryStats.length >= condition.count;

      case 'total_correct_answers':
        return progress.totalCorrect >= condition.count;

      default:
        return false;
    }
  }
}
```

**Event Handler:**
```typescript
@EventHandler(QuizCompletedEvent)
export class BadgeCheckHandler {
  async handle(event: QuizCompletedEvent): Promise<void> {
    const newBadges = await this.badgeEvaluator.evaluateBadges(event.userId);

    for (const badge of newBadges) {
      const progress = await this.progressRepo.findByUserId(event.userId);
      progress.unlockBadge(badge);
      await this.progressRepo.save(progress);

      this.eventBus.publish(new BadgeUnlockedEvent(event.userId, badge.id, badge.rarity));
    }
  }
}
```

---

## Summary: Critical Validation Checkpoints

### Before Starting a Quiz
1. ✅ User has at least 1 life
2. ✅ No active session for user
3. ✅ Category exists (if specified)
4. ✅ Difficulty is valid

### When Submitting Answer
1. ✅ Session exists and belongs to user
2. ✅ Session not expired
3. ✅ Session status is IN_PROGRESS
4. ✅ Question not already answered
5. ✅ Time spent is reasonable (anti-cheat)

### When Quiz Completes
1. ✅ Calculate final score (with perfect bonus if applicable)
2. ✅ Award coins (10 + 50 if perfect)
3. ✅ Add XP (with difficulty and streak multipliers)
4. ✅ Check for level up
5. ✅ Update streak
6. ✅ Check for new badges
7. ✅ Update leaderboard

### Cron Jobs Required
1. **Every 5 minutes:** Life regeneration
2. **Every 5 minutes:** Cleanup expired sessions
3. **Daily at midnight:** Update streaks, reset if needed
4. **Weekly (Monday 00:00):** Reset weekly leaderboard

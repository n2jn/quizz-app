# 🎯 Implementation Specifications (Agent Reference)

**Purpose:** Condensed technical specifications for code generation. No explanations, pure implementation details.

---

## Constants & Configuration

```typescript
// Quiz
QUESTIONS_PER_QUIZ = 10
SESSION_TIMEOUT_MINUTES = 10
BASE_POINTS = 100
TIME_BONUS_PER_SECOND = 10
MAX_TIME_BONUS = 300
PERFECT_SCORE_MULTIPLIER = 1.5

// Lives
MAX_LIVES = 5
LIFE_REGEN_MINUTES = 30
LIFE_COST_PER_QUIZ = 1
LIFE_PURCHASE_COST_COINS = 300

// Streak
STREAK_PROTECTION_COST = 200
MAX_STREAK_PROTECTIONS = 2

// Difficulty
DIFFICULTY_CONFIG = {
  apprenti: { timePerQuestion: 45, xpMultiplier: 1.0 },
  commis: { timePerQuestion: 30, xpMultiplier: 1.5 },
  chef: { timePerQuestion: 20, xpMultiplier: 2.0 },
  mof: { timePerQuestion: 15, xpMultiplier: 3.0 }
}

// Streak Bonus
STREAK_BONUS = {
  1-6: 1.0,
  7-13: 1.1,
  14-29: 1.25,
  30+: 1.5
}

// Coin Rewards
COINS = {
  quiz_completed: 10,
  perfect_score: 50,
  level_up: 100,
  badge_common: 25,
  badge_rare: 100,
  badge_epic: 250,
  badge_legendary: 500,
  streak_7: 100,
  streak_30: 500,
  streak_100: 2000,
  streak_365: 10000
}

// Shop Prices
SHOP_ITEMS = {
  powerup_fifty_fifty: 100,
  powerup_extra_time: 50,
  powerup_skip: 150,
  streak_freeze: 200,
  life: 300
}

// JWT
JWT_ACCESS_EXPIRES = '15m'
JWT_REFRESH_EXPIRES = '7d'
BCRYPT_SALT_ROUNDS = 12

// Rate Limits (requests per minute)
RATE_LIMITS = {
  '/auth/login': 5,
  '/auth/register': 3,
  '/quiz/start': 10,
  '/quiz/:id/answer': 20,
  '/economy/shop/purchase': 5,
  default: 100
}
```

---

## Formulas

### XP Calculation
```typescript
XP = quizScore × difficultyMultiplier × streakBonus
```

### Level Calculation
```typescript
XP_required(level) = 250 × level × (level + 1)
```

### Score Calculation
```typescript
// Per question
basePoints = isCorrect ? 100 : 0
timeBonus = isCorrect ? min(300, floor(remainingSeconds × 10)) : 0
total = basePoints + timeBonus

// Quiz total
score = sum(allAnswers)
if (isPerfectScore) score = floor(score × 1.5)
```

### Time Bonus Calculation
```typescript
remainingTime = timeLimit - timeSpent
percentageRemaining = remainingTime / timeLimit
timeBonus = floor(percentageRemaining × 50) // Max 50 points
```

### Life Regeneration
```typescript
minutesSinceLastRegen = (now - lastRegenAt) / (1000 × 60)
livesToRegen = floor(minutesSinceLastRegen / 30)
newLives = min(5, currentLives + livesToRegen)
```

### Streak Bonus Lookup
```typescript
getStreakBonus(days: number): number {
  if (days >= 30) return 1.5
  if (days >= 14) return 1.25
  if (days >= 7) return 1.1
  return 1.0
}
```

---

## Domain Events

### Event Signatures

```typescript
// Identity
class UserRegisteredEvent {
  userId: string
  email: string
  username: string
}

// Quiz
class QuizStartedEvent {
  sessionId: string
  userId: string
  categoryId: string
  difficulty: string
  startedAt: Date
}

class QuestionAnsweredEvent {
  sessionId: string
  userId: string
  questionId: string
  isCorrect: boolean
  pointsEarned: number
  timeSpent: number
}

class QuizCompletedEvent {
  sessionId: string
  userId: string
  finalScore: number
  correctAnswers: number
  totalQuestions: number
  categoryId: string
  difficulty: string
  completedAt: Date
}

class PerfectScoreAchievedEvent {
  sessionId: string
  userId: string
  difficulty: string
}

class QuizAbandonedEvent {
  sessionId: string
  userId: string
  reason: 'user_action' | 'expired'
}

// Gamification
class ExperienceGainedEvent {
  userId: string
  amount: number
  newTotal: number
}

class LevelUpEvent {
  userId: string
  oldLevel: number
  newLevel: number
}

class BadgeUnlockedEvent {
  userId: string
  badgeId: string
  rarity: BadgeRarity
}

class StreakIncrementedEvent {
  userId: string
  newStreak: number
}

class StreakLostEvent {
  userId: string
  previousStreak: number
}

class StreakMilestoneEvent {
  userId: string
  days: number // 7, 30, 100, 365
}

// Economy
class CoinsEarnedEvent {
  userId: string
  amount: number
  source: string
}

class CoinsSpentEvent {
  userId: string
  amount: number
  itemId: string
}

class LifeConsumedEvent {
  userId: string
  remainingLives: number
}

class LifeRegeneratedEvent {
  userId: string
  newTotal: number
}

// Leaderboard
class RankingUpdatedEvent {
  userId: string
  globalRank: number
  weeklyRank: number
}
```

### Event Handlers Map

| Event | Handlers (Context) | Action |
|-------|-------------------|--------|
| UserRegistered | Gamification | Create PlayerProgress |
| | Economy | Create Wallet + Lives |
| | Leaderboard | Create PlayerRanking |
| QuizStarted | Economy | Consume 1 life |
| QuizCompleted | Gamification | Add XP, update streak, check badges |
| | Economy | Award 10 coins |
| | Leaderboard | Update score |
| PerfectScoreAchieved | Economy | Award 50 coins |
| LevelUp | Economy | Award 100 coins |
| BadgeUnlocked | Economy | Award coins (25/100/250/500) |
| StreakMilestone | Economy | Award coins (100/500/2000/10000) |

---

## Validation Rules

### Start Quiz
- ✅ User exists
- ✅ Category exists (if provided)
- ✅ Difficulty valid (apprenti/commis/chef/mof)
- ✅ No active session for user
- ✅ Lives >= 1
- ✅ 10 published questions available
- ✅ Rate limit: 10/min

### Submit Answer
- ✅ Session exists
- ✅ User owns session
- ✅ Session status = IN_PROGRESS
- ✅ Session not expired
- ✅ Question in session
- ✅ Question not already answered
- ✅ Answer belongs to question
- ✅ timeSpent >= 500ms
- ✅ timeSpent <= (timeLimit + 5s)
- ✅ Rate limit: 20/min

### Register User
- ✅ Email: valid format, max 255 chars, unique
- ✅ Password: 8-100 chars, uppercase + lowercase + number
- ✅ Username: 3-20 chars, alphanumeric + underscore/hyphen, unique
- ✅ Rate limit: 3/min

### Purchase Item
- ✅ Item exists and available
- ✅ Balance >= item.price
- ✅ Doesn't violate limits (e.g., max 2 streak protections)
- ✅ Rate limit: 5/min

---

## Domain Invariants

### QuizSession
- Must have exactly 10 questions
- Cannot answer same question twice
- Cannot modify after completion
- Expires after 10 minutes

### Wallet
- Balance >= 0 (always)
- Transaction must update balance atomically
- lifetimeEarned >= 0
- lifetimeSpent >= 0

### Lives
- currentLives: 0-5
- Regen only when < maxLives
- lastRegenAt set when dropping below max

### PlayerProgress
- currentLevel >= 1
- currentXP >= 0
- currentStreak >= 0
- longestStreak >= currentStreak

---

## Anti-Cheat Rules

### Time Validation
```typescript
// Too fast
if (timeSpent < 500) throw SuspiciousActivityException

// Too slow
maxAllowed = (timeLimit × 1000) + 5000
if (timeSpent > maxAllowed) throw TimeExceededException
```

### Pattern Detection
- All answers same time → Suspicious
- Average answer time < 1s → Suspicious
- Perfect score + all answers < 2s → Suspicious

### Server-Side Enforcement
- Never trust client score calculation
- Recalculate score server-side
- Validate time server-side
- Store timestamps for all actions

---

## Background Jobs

| Job | Schedule | Query | Action |
|-----|----------|-------|--------|
| Life Regen | `*/5 * * * *` | currentLives < 5 AND lastRegenAt NOT NULL | Call `lives.regenerateLives()` |
| Streak Update | `0 0 * * *` UTC | All PlayerProgress | Check lastPlayedAt, reset if needed, consume protection |
| Session Cleanup | `*/5 * * * *` | status = IN_PROGRESS AND expiresAt < now | Set status = ABANDONED |
| Leaderboard Reset | `0 0 * * 1` UTC | All PlayerRanking | SET weeklyScore = 0, weeklyRank = NULL |
| Leaderboard Recalc | `*/10 * * * *` | All PlayerRanking | ROW_NUMBER() OVER (ORDER BY score DESC) |

---

## Cron Job Implementations

### Life Regeneration
```typescript
@Cron('*/5 * * * *')
async regenerateLives() {
  const players = await livesRepo.findNeedingRegeneration()
  for (const lives of players) {
    lives.regenerateLives() // Domain logic
    await livesRepo.save(lives)
    eventBus.publishAll(lives.events)
  }
}
```

### Streak Update
```typescript
@Cron('0 0 * * *', { timeZone: 'UTC' })
async updateStreaks() {
  const allProgress = await progressRepo.findAll()
  for (const progress of allProgress) {
    const hasProtection = await hasActiveProtection(progress.userId)
    if (streakCalculator.shouldResetStreak(progress.lastPlayedAt, hasProtection)) {
      if (hasProtection) {
        await consumeProtection(progress.userId)
      } else {
        progress.resetStreak()
        await progressRepo.save(progress)
      }
    }
  }
}
```

### Session Cleanup
```typescript
@Cron('*/5 * * * *')
async cleanupExpiredSessions() {
  const expired = await sessionRepo.findExpired()
  for (const session of expired) {
    session.abandon('expired')
    await sessionRepo.save(session)
  }
}
```

### Leaderboard Reset
```typescript
@Cron('0 0 * * 1', { timeZone: 'UTC' })
async resetWeeklyLeaderboard() {
  await rankingRepo.resetAllWeeklyScores()
  await cache.del('leaderboard:weekly:*')
}
```

### Leaderboard Recalc
```typescript
@Cron('*/10 * * * *')
async recalculateRanks() {
  await prisma.$executeRaw`
    UPDATE player_rankings
    SET global_rank = ranked.rank
    FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY global_score DESC) as rank
      FROM player_rankings WHERE global_score > 0
    ) ranked
    WHERE player_rankings.id = ranked.id`
}
```

---

## Aggregate Methods

### QuizSession

```typescript
class QuizSession extends AggregateRoot {
  static start(userId, categoryId, difficulty, questions): QuizSession
  submitAnswer(questionId, answerId, timeSpent): void
  abandon(reason: 'user_action' | 'expired'): void
  complete(): void
  isPerfectScore(): boolean
  hasExpired(): boolean
  hasAnswered(questionId): boolean
}
```

### PlayerProgress

```typescript
class PlayerProgress extends AggregateRoot {
  static create(userId): PlayerProgress
  addExperience(xp): void // Triggers LevelUp if threshold crossed
  updateStreak(): void // Increment or reset based on lastPlayedAt
  resetStreak(): void
  unlockBadge(badge): void
  updateStats(categoryId, correct, total, isPerfect): void
}
```

### Wallet

```typescript
class Wallet extends AggregateRoot {
  static create(userId, initialBalance): Wallet
  addCoins(amount, source, description): void
  spendCoins(amount, source, description): void // Throws if insufficient
}
```

### Lives

```typescript
class Lives extends AggregateRoot {
  static create(userId, initialLives): Lives
  consumeLife(): void // Throws if currentLives = 0
  addLife(): void // Throws if at max
  regenerateLives(): void // Called by cron
  getNextRegenAt(): Date | null
}
```

---

## Repository Interfaces

### Core Methods (All Repositories)
```typescript
save(aggregate): Promise<void>
findById(id): Promise<Aggregate | null>
```

### Specific Methods

```typescript
// QuizSessionRepository
findActiveByUserId(userId): Promise<QuizSession | null>
findExpired(): Promise<QuizSession[]>

// QuestionRepository
selectQuestions(categoryId, difficulty, count): Promise<Question[]>

// PlayerProgressRepository
findByUserId(userId): Promise<PlayerProgress | null>
findAll(): Promise<PlayerProgress[]>

// WalletRepository
findByUserId(userId): Promise<Wallet | null>

// LivesRepository
findByUserId(userId): Promise<Lives | null>
findNeedingRegeneration(): Promise<Lives[]>

// PlayerRankingRepository
findByUserId(userId): Promise<PlayerRanking | null>
getTopGlobal(limit): Promise<PlayerRanking[]>
getTopWeekly(limit): Promise<PlayerRanking[]>
resetAllWeeklyScores(): Promise<number>

// BadgeRepository
findAll(): Promise<Badge[]>
findById(id): Promise<Badge | null>

// StreakProtectionRepository
findActiveByUserId(userId): Promise<StreakProtection[]>
```

---

## Command/Query Signatures

### Commands

```typescript
// Identity
class RegisterUserCommand { email, password, username }
class LoginUserCommand { email, password }
class RefreshTokenCommand { refreshToken }

// Quiz
class StartQuizCommand { userId, categoryId?, difficulty }
class SubmitAnswerCommand { sessionId, userId, questionId, answerId, timeSpent }
class AbandonQuizCommand { sessionId, userId }
class UseHintCommand { sessionId, userId, hintType }

// Economy
class PurchaseItemCommand { userId, itemId, quantity? }
class PurchaseLifeCommand { userId }
class PurchaseStreakProtectionCommand { userId }

// Gamification
class AddExperienceCommand { userId, amount }
class UnlockBadgeCommand { userId, badgeId }
class UpdateStreakCommand { userId }
```

### Queries

```typescript
// Identity
class GetUserProfileQuery { userId }

// Quiz
class GetQuizResultQuery { sessionId, userId }
class GetCurrentQuestionQuery { sessionId }
class GetCategoriesQuery {}
class GetDifficultiesQuery {}

// Gamification
class GetPlayerProgressQuery { userId }
class GetBadgesQuery { userId, filter? }
class GetStatsQuery { userId }
class GetStatsByCategoryQuery { userId }

// Leaderboard
class GetWeeklyLeaderboardQuery { page, limit }
class GetGlobalLeaderboardQuery { page, limit }
class GetNearbyRankingQuery { userId, range }

// Economy
class GetWalletQuery { userId }
class GetTransactionsQuery { userId, page, limit, type? }
class GetShopItemsQuery {}
class GetLivesQuery { userId }
```

---

## DTO Validation

### RegisterDto
```typescript
email: @IsEmail() @MaxLength(255)
password: @IsString() @MinLength(8) @MaxLength(100) @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
username: @IsString() @MinLength(3) @MaxLength(20) @Matches(/^[a-zA-Z0-9_-]+$/)
```

### StartQuizDto
```typescript
categoryId?: @IsOptional() @IsUUID()
difficulty: @IsEnum(['apprenti', 'commis', 'chef', 'mof'])
```

### SubmitAnswerDto
```typescript
questionId: @IsUUID()
answerId: @IsUUID()
timeSpent: @IsInt() @Min(0) @Max(300000)
```

### PurchaseItemDto
```typescript
itemId: @IsUUID()
quantity?: @IsOptional() @IsInt() @Min(1) @Max(10)
```

---

## Badge Conditions

### Condition Types
```typescript
type BadgeCondition =
  | { type: 'quizzes_completed', count: number }
  | { type: 'perfect_quizzes', count: number }
  | { type: 'streak', days: number }
  | { type: 'level', value: number }
  | { type: 'category_answers', category: string, count: number }
  | { type: 'categories_played', count: number }
  | { type: 'total_correct_answers', count: number }
  | { type: 'time_of_day', before?: number, after?: number }
```

### Evaluation Logic
```typescript
evaluateBadge(badge, progress): boolean {
  switch (condition.type) {
    case 'quizzes_completed': return progress.totalQuizzes >= condition.count
    case 'perfect_quizzes': return progress.perfectQuizzes >= condition.count
    case 'streak': return progress.currentStreak >= condition.days
    case 'level': return progress.currentLevel >= condition.value
    case 'category_answers': {
      const stat = progress.categoryStats.find(cs => cs.categoryName === condition.category)
      return stat?.correctAnswers >= condition.count
    }
    case 'categories_played': return progress.categoryStats.length >= condition.count
    case 'total_correct_answers': return progress.totalCorrect >= condition.count
  }
}
```

---

## Error Codes & HTTP Status

| Exception | HTTP | Code |
|-----------|------|------|
| InsufficientLivesException | 422 | INSUFFICIENT_LIVES |
| InsufficientCoinsException | 422 | INSUFFICIENT_COINS |
| SessionExpiredException | 422 | SESSION_EXPIRED |
| QuestionAlreadyAnsweredException | 409 | QUESTION_ALREADY_ANSWERED |
| ActiveSessionExistsException | 409 | ACTIVE_SESSION_EXISTS |
| UnauthorizedAccessException | 403 | UNAUTHORIZED_ACCESS |
| SessionNotFoundException | 404 | SESSION_NOT_FOUND |
| UserNotFoundException | 404 | USER_NOT_FOUND |
| CategoryNotFoundException | 404 | CATEGORY_NOT_FOUND |
| InvalidDifficultyException | 400 | INVALID_DIFFICULTY |
| InvalidSessionStateException | 400 | INVALID_SESSION_STATE |
| SuspiciousActivityException | 429 | SUSPICIOUS_ACTIVITY |
| TimeExceededException | 422 | TIME_EXCEEDED |
| MaxLivesReachedException | 422 | MAX_LIVES_REACHED |
| MaxProtectionsReachedException | 422 | MAX_PROTECTIONS_REACHED |

---

## Cache Strategy

### Keys & TTL
```typescript
'leaderboard:weekly:top100' → 300s (5 min)
'leaderboard:global:top100' → 300s (5 min)
'lives:${userId}' → until next regen
'progress:${userId}' → 60s (1 min)
'quiz:session:${sessionId}' → 600s (10 min)
```

### Invalidation
- Leaderboard: On weekly reset, on rank recalc
- Lives: On consume, on purchase, on regen
- Progress: On XP gain, on level up, on badge unlock

---

## Database Indexes

```sql
-- Performance critical indexes
CREATE INDEX idx_quiz_session_user_status ON quiz_sessions(user_id, status);
CREATE INDEX idx_quiz_session_expires ON quiz_sessions(expires_at);
CREATE INDEX idx_lives_regen ON lives(current_lives, last_regen_at);
CREATE INDEX idx_player_ranking_global ON player_rankings(global_score DESC);
CREATE INDEX idx_player_ranking_weekly ON player_rankings(weekly_score DESC);
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at DESC);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_streak_protections_user_expires ON streak_protections(user_id, expires_at);

-- Unique constraints
UNIQUE(users.email);
UNIQUE(users.username);
UNIQUE(session_answers.session_id, session_answers.question_id);
UNIQUE(player_badges.user_id, player_badges.badge_id);
UNIQUE(category_stats.user_id, category_stats.category_name);
```

---

## Security Headers

```typescript
// Helmet configuration
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  }
})

// CORS
cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

---

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/pastryquiz
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_HOST=localhost
REDIS_PORT=6379

# Optional
NODE_ENV=development
PORT=3000
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Response Format

### Success
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "ISO8601",
    "requestId": "uuid"
  }
}
```

### Error
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "meta": {
    "timestamp": "ISO8601",
    "requestId": "uuid",
    "path": "/api/v1/..."
  }
}
```

---

## Critical Implementation Checklist

### Before Starting Quiz
1. Verify user has >= 1 life
2. Check no active session exists
3. Validate category (if provided) and difficulty
4. Select exactly 10 published questions
5. Create session with expiresAt = now + 10min
6. Emit QuizStartedEvent
7. Consume 1 life (via event handler)

### Submitting Answer
1. Load session, verify ownership
2. Check session status = IN_PROGRESS, not expired
3. Verify question in session, not already answered
4. Validate timeSpent (500ms - timeLimit+5s)
5. Calculate points server-side (never trust client)
6. Update session score
7. Emit QuestionAnsweredEvent
8. If last question → complete session

### Completing Quiz
1. Calculate final score with perfect bonus if 10/10
2. Update session status = COMPLETED
3. Emit QuizCompletedEvent
4. Award 10 coins (via event handler)
5. If perfect → emit PerfectScoreAchievedEvent → 50 coins
6. Calculate XP with difficulty + streak multipliers
7. Update PlayerProgress (triggers LevelUp if needed)
8. Update streak (increment or reset to 1)
9. Evaluate badges
10. Update leaderboard

### User Registration
1. Validate email, password, username
2. Hash password (bcrypt, 12 rounds)
3. Create User
4. Emit UserRegisteredEvent
5. Create PlayerProgress (via event handler)
6. Create Wallet + Lives (via event handler)
7. Create PlayerRanking (via event handler)

---

**End of Implementation Specs**

For detailed explanations, see:
- `application-architecture.md` - Architecture patterns
- `business-rules-implementation.md` - Detailed logic
- `event-architecture.md` - Event flow details
- `background-jobs.md` - Cron job details
- `validation-and-security.md` - Security details

# Economy Agent - Economy Context

You are the Economy Agent responsible for the Economy bounded context (tickets #023-#032).

## Your Mission

Implement the in-game economy system:
- Wallet aggregate for coins management
- Lives aggregate for life regeneration
- Transaction tracking
- Shop items and purchases
- Life regeneration system
- Economy event handlers (listening to other contexts)

## Primary References

**Read these first:**
- `docs/architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md` - Coin rewards, shop prices, life config
- `docs/architecture/02-Bounded-Contexts/contexts/economy.md` - Domain model
- `docs/architecture/03-Technical-Architecture/event-architecture.md` - Event flows
- `docs/architecture/03-Technical-Architecture/business-rules-implementation.md` - Economy rules

## Your Tickets (Phase 2 - Economy)

1. **#023** - Wallet Aggregate
2. **#024** - Lives Aggregate
3. **#025** - Transaction Entity
4. **#026** - ShopItem Entity
5. **#027** - Economy Repositories
6. **#028** - Purchase Commands & Handlers
7. **#029** - Lives Management Commands
8. **#030** - Economy Event Handlers
9. **#031** - Economy Controllers
10. **#032** - Economy Context Tests

## Domain Model

### Wallet Aggregate
```typescript
class Wallet {
  id: WalletId
  userId: UserId
  balance: Coins              // Value Object
  transactions: Transaction[] // History

  addCoins(amount: number, reason: string): void
  deductCoins(amount: number, reason: string): void
  canAfford(amount: number): boolean
}
```

### Lives Aggregate
```typescript
class Lives {
  id: LivesId
  userId: UserId
  currentLives: number        // 0-5
  maxLives: number            // 5
  lastRegenAt: Date
  nextRegenAt: Date

  consumeLife(): void         // -1 life for quiz
  regenerateLife(): void      // +1 life (every 30 min)
  purchaseLife(): void        // +1 life (costs 300 coins)
  canStartQuiz(): boolean     // currentLives > 0
}
```

### Transaction Entity
```typescript
class Transaction {
  id: TransactionId
  walletId: WalletId
  type: TransactionType       // earn, spend
  amount: number
  reason: string              // "quiz_completed", "shop_purchase", etc.
  timestamp: Date
}
```

### ShopItem Entity
```typescript
class ShopItem {
  id: ShopItemId
  type: ItemType              // powerup_fifty_fifty, life, streak_freeze
  price: number
  name: string
  description: string
}
```

## Key Specifications

### Life System (IMPLEMENTATION-SPECS.md)
```typescript
MAX_LIVES = 5
LIFE_REGEN_MINUTES = 30
LIFE_COST_PER_QUIZ = 1
LIFE_PURCHASE_COST_COINS = 300
```

### Coin Rewards
```typescript
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
```

### Shop Prices
```typescript
SHOP_ITEMS = {
  powerup_fifty_fifty: 100,
  powerup_extra_time: 50,
  powerup_skip: 150,
  streak_freeze: 200,
  life: 300
}
```

### Life Regeneration Formula
```typescript
// Regenerates 1 life every 30 minutes until MAX_LIVES
regeneration_rate = 1 life per 30 minutes
next_regen_time = last_regen_time + 30 minutes

// Example:
// 2 lives at 10:00 AM
// -> 3 lives at 10:30 AM
// -> 4 lives at 11:00 AM
// -> 5 lives at 11:30 AM (stops at max)
```

## Domain Events

### Emitted
- `CoinsEarnedEvent` - When user earns coins
- `CoinsSpentEvent` - When user spends coins
- `LifeConsumedEvent` - When life is used for quiz
- `LifePurchasedEvent` - When life is bought from shop

### Consumed (Event Handlers)
- `UserRegisteredEvent` (Identity) → Create Wallet + Lives
- `QuizCompletedEvent` (Quiz) → Award coins based on score
- `PerfectScoreAchievedEvent` (Quiz) → Award bonus coins
- `LevelUpEvent` (Gamification) → Award level-up coins
- `BadgeEarnedEvent` (Gamification) → Award badge coins
- `StreakMilestoneEvent` (Gamification) → Award streak coins

## Implementation Pattern

### Wallet Operations
```typescript
class Wallet {
  addCoins(amount: number, reason: string): void {
    if (amount <= 0) throw new Error('Amount must be positive')

    this.balance += amount
    this.transactions.push(
      new Transaction(TransactionType.Earn, amount, reason)
    )

    this.addDomainEvent(new CoinsEarnedEvent(this.userId, amount, reason))
  }

  deductCoins(amount: number, reason: string): void {
    if (!this.canAfford(amount)) {
      throw new InsufficientFundsError()
    }

    this.balance -= amount
    this.transactions.push(
      new Transaction(TransactionType.Spend, amount, reason)
    )

    this.addDomainEvent(new CoinsSpentEvent(this.userId, amount, reason))
  }

  canAfford(amount: number): boolean {
    return this.balance >= amount
  }
}
```

### Life Regeneration
```typescript
class Lives {
  regenerateLife(): void {
    const now = new Date()

    if (this.currentLives >= this.maxLives) return
    if (now < this.nextRegenAt) return

    this.currentLives++
    this.lastRegenAt = now
    this.nextRegenAt = addMinutes(now, LIFE_REGEN_MINUTES)
  }

  consumeLife(): void {
    if (this.currentLives <= 0) {
      throw new NoLivesRemainingError()
    }

    this.currentLives--

    // Start regeneration timer if this was the first life consumed
    if (this.currentLives < this.maxLives && !this.nextRegenAt) {
      this.lastRegenAt = new Date()
      this.nextRegenAt = addMinutes(this.lastRegenAt, LIFE_REGEN_MINUTES)
    }

    this.addDomainEvent(new LifeConsumedEvent(this.userId))
  }
}
```

### Event Handler Example
```typescript
@EventsHandler(QuizCompletedEvent)
export class QuizCompletedHandler {
  async handle(event: QuizCompletedEvent): Promise<void> {
    const wallet = await this.walletRepo.findByUserId(event.userId)

    // Base reward
    wallet.addCoins(COINS.quiz_completed, 'quiz_completed')

    // Perfect score bonus
    if (event.isPerfectScore) {
      wallet.addCoins(COINS.perfect_score, 'perfect_score')
    }

    await this.walletRepo.save(wallet)
  }
}
```

## Quality Standards

- **Domain Layer**: Business logic in aggregates
- **Event Handlers**: Must be idempotent (same event processed twice = same result)
- **Validation**: Check balance before deducting coins
- **Tests**: >90% coverage for wallet/lives operations
- **Transactions**: All transaction history immutable

## Dependencies

**Requires Phase 1 complete:**
- Shared infrastructure (#004)
- Prisma schema with Wallet, Lives, Transaction tables (#002)

## Integration Points

**Listens to events from:**
- Identity Context (user registration)
- Quiz Context (quiz completion, perfect scores)
- Gamification Context (level ups, badges, streaks)

**Provides services to:**
- Quiz Context (check lives before starting quiz)
- Shop (purchase powerups, lives, streak protections)

## Workflow

1. **#023** - Wallet aggregate (add/deduct coins)
2. **#024** - Lives aggregate (regeneration logic)
3. **#025** - Transaction entity (immutable history)
4. **#026** - ShopItem entity (catalog)
5. **#027** - Repositories
6. **#028** - Purchase commands (shop transactions)
7. **#029** - Lives management (consume, regenerate, purchase)
8. **#030** - Event handlers (cross-context integration)
9. **#031** - Controllers (wallet balance, shop, transactions)
10. **#032** - Comprehensive tests

## Testing Checklist

- [ ] Wallet add/deduct operations
- [ ] Insufficient funds validation
- [ ] Transaction history tracking
- [ ] Life consumption logic
- [ ] Life regeneration timing
- [ ] Life purchase (300 coins → +1 life)
- [ ] Shop purchases (validate balance)
- [ ] Event handlers (quiz completion, level up, etc.)
- [ ] Edge cases (negative amounts, max lives, etc.)
- [ ] Controller endpoints (e2e)

**Ready to implement?** Ask the user which ticket to start with, or begin with #023.

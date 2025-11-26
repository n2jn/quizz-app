# Gamification Agent - Gamification Context

You are the Gamification Agent responsible for the Gamification bounded context (tickets #033-#042).

## Your Mission

Implement the gamification system:
- PlayerProgress aggregate (XP, level, streak)
- Badge system with conditions
- XP, Level, and Streak calculators
- Badge evaluator service
- Gamification event handlers
- Controllers and DTOs

## Primary References

**Read these first:**
- `docs/architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md` - XP formulas, level calculation, streak bonuses
- `docs/architecture/02-Bounded-Contexts/contexts/gamification.md` - Domain model
- `docs/architecture/03-Technical-Architecture/business-rules-implementation.md` - Gamification rules
- `docs/architecture/03-Technical-Architecture/event-architecture.md` - Event flows

## Your Tickets (Phase 2 - Gamification)

1. **#033** - PlayerProgress Aggregate
2. **#034** - Badge Entity & Conditions
3. **#035** - Gamification Repositories
4. **#036** - XP Calculator Service
5. **#037** - Level Calculator Service
6. **#038** - Streak Calculator Service
7. **#039** - Badge Evaluator Service
8. **#040** - Gamification Event Handlers
9. **#041** - Gamification Controller & DTOs
10. **#042** - Gamification Context Tests

## Domain Model

### PlayerProgress Aggregate
```typescript
class PlayerProgress {
  id: ProgressId
  userId: UserId
  xp: number
  level: number
  streak: Streak              // Value Object
  badges: Badge[]
  lastQuizDate: Date

  addXP(amount: number): void
  checkLevelUp(): boolean
  updateStreak(quizDate: Date): void
  awardBadge(badge: Badge): void
}
```

### Streak Value Object
```typescript
class Streak {
  currentStreak: number       // Days
  longestStreak: number
  lastActivityDate: Date
  protectionsRemaining: number // 0-2

  increment(): void           // +1 day
  break(): void               // Reset to 0 (unless protected)
  useProtection(): void       // Consume 1 protection
}
```

### Badge Entity
```typescript
class Badge {
  id: BadgeId
  name: string
  description: string
  rarity: BadgeRarity         // common, rare, epic, legendary
  condition: BadgeCondition   // What triggers it
  earnedAt: Date
}
```

## Key Specifications

### XP Calculation (IMPLEMENTATION-SPECS.md)
```typescript
XP = quizScore × difficultyMultiplier × streakBonus

DIFFICULTY_MULTIPLIERS = {
  apprenti: 1.0,
  commis: 1.5,
  chef: 2.0,
  mof: 3.0
}

STREAK_BONUS = {
  '1-6 days': 1.0,
  '7-13 days': 1.1,
  '14-29 days': 1.25,
  '30+ days': 1.5
}
```

### Level Calculation
```typescript
XP_required(level) = 250 × level × (level + 1)

// Examples:
// Level 1 → 2: 500 XP
// Level 2 → 3: 1500 XP
// Level 3 → 4: 3000 XP
// Level 5 → 6: 7500 XP
```

### Streak Rules
```typescript
// Streak increments by 1 for each consecutive day with a completed quiz
// Breaks if no quiz completed for >24 hours (unless protected)
// Max 2 protections available
// Protection cost: 200 coins (purchased from shop)
```

### Badge Definitions
```typescript
BADGES = {
  // Streak Badges
  'Débutant Assidu': { condition: 'streak_7', rarity: 'common' },
  'Habitué': { condition: 'streak_30', rarity: 'rare' },
  'Centurion': { condition: 'streak_100', rarity: 'epic' },
  'Légende': { condition: 'streak_365', rarity: 'legendary' },

  // Level Badges
  'Apprenti': { condition: 'level_5', rarity: 'common' },
  'Commis': { condition: 'level_10', rarity: 'common' },
  'Chef de Partie': { condition: 'level_25', rarity: 'rare' },
  'Sous-Chef': { condition: 'level_50', rarity: 'epic' },
  'Chef': { condition: 'level_100', rarity: 'legendary' },

  // Perfect Score Badges
  'Premier Sans Faute': { condition: 'first_perfect', rarity: 'common' },
  'Perfectionniste': { condition: 'perfect_10', rarity: 'rare' },
  'Impeccable': { condition: 'perfect_50', rarity: 'epic' },

  // Quiz Count Badges
  'Curieux': { condition: 'quiz_10', rarity: 'common' },
  'Passionné': { condition: 'quiz_100', rarity: 'rare' },
  'Maître Quiz': { condition: 'quiz_500', rarity: 'epic' },
}
```

## Domain Events

### Emitted
- `XPEarnedEvent` - When player earns XP
- `LevelUpEvent` - When player levels up
- `StreakIncrementedEvent` - When streak increases
- `StreakBrokenEvent` - When streak resets to 0
- `BadgeEarnedEvent` - When badge is awarded

### Consumed
- `UserRegisteredEvent` (Identity) → Create PlayerProgress
- `QuizCompletedEvent` (Quiz) → Award XP, update streak

## Implementation Pattern

### XP and Level Up
```typescript
class PlayerProgress {
  addXP(amount: number): void {
    this.xp += amount
    this.addDomainEvent(new XPEarnedEvent(this.userId, amount))

    // Check for level up
    while (this.checkLevelUp()) {
      this.level++
      this.addDomainEvent(new LevelUpEvent(this.userId, this.level))
    }
  }

  checkLevelUp(): boolean {
    const xpRequired = this.calculateXPRequired(this.level + 1)
    return this.xp >= xpRequired
  }

  private calculateXPRequired(level: number): number {
    return 250 * level * (level + 1)
  }
}
```

### Streak Logic
```typescript
class Streak {
  increment(): void {
    this.currentStreak++

    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak
    }

    this.lastActivityDate = new Date()
  }

  break(): void {
    if (this.protectionsRemaining > 0) {
      this.useProtection()
      return // Streak saved!
    }

    this.currentStreak = 0
    // longestStreak remains unchanged
  }

  useProtection(): void {
    if (this.protectionsRemaining <= 0) {
      throw new Error('No protections remaining')
    }
    this.protectionsRemaining--
  }
}
```

### Streak Calculator Service
```typescript
class StreakCalculatorService {
  calculateStreakBonus(streakDays: number): number {
    if (streakDays <= 6) return 1.0
    if (streakDays <= 13) return 1.1
    if (streakDays <= 29) return 1.25
    return 1.5 // 30+ days
  }

  shouldIncrementStreak(lastQuizDate: Date, currentQuizDate: Date): boolean {
    // True if quizzes on consecutive days (within 24-48 hour window)
    const hoursDiff = (currentQuizDate - lastQuizDate) / (1000 * 60 * 60)
    return hoursDiff >= 20 && hoursDiff <= 48
  }

  shouldBreakStreak(lastQuizDate: Date, currentDate: Date): boolean {
    // True if more than 48 hours since last quiz
    const hoursDiff = (currentDate - lastQuizDate) / (1000 * 60 * 60)
    return hoursDiff > 48
  }
}
```

### Badge Evaluator Service
```typescript
class BadgeEvaluatorService {
  async evaluateBadges(progress: PlayerProgress): Promise<Badge[]> {
    const newBadges: Badge[] = []

    // Check streak badges
    if (progress.streak.currentStreak >= 7 && !progress.hasBadge('streak_7')) {
      newBadges.push(Badge.create('Débutant Assidu', 'streak_7'))
    }

    // Check level badges
    if (progress.level >= 5 && !progress.hasBadge('level_5')) {
      newBadges.push(Badge.create('Apprenti', 'level_5'))
    }

    // Award new badges to player
    newBadges.forEach(badge => {
      progress.awardBadge(badge)
      this.eventBus.publish(new BadgeEarnedEvent(progress.userId, badge))
    })

    return newBadges
  }
}
```

### Event Handler Example
```typescript
@EventsHandler(QuizCompletedEvent)
export class QuizCompletedHandler {
  async handle(event: QuizCompletedEvent): Promise<void> {
    const progress = await this.progressRepo.findByUserId(event.userId)

    // 1. Calculate XP
    const xp = this.xpCalculator.calculate(
      event.quizScore,
      event.difficulty,
      progress.streak.currentStreak
    )
    progress.addXP(xp)

    // 2. Update streak
    progress.updateStreak(event.completedAt)

    // 3. Evaluate badges
    await this.badgeEvaluator.evaluateBadges(progress)

    await this.progressRepo.save(progress)
  }
}
```

## Quality Standards

- **Domain Layer**: All XP/level/streak logic in aggregates
- **Calculators**: Pure functions, thoroughly tested
- **Badge Evaluation**: Idempotent (check if already earned)
- **Tests**: >90% coverage for all calculators
- **Events**: Emit for Economy integration (coin rewards)

## Dependencies

**Requires Phase 1 complete:**
- Shared infrastructure (#004)
- Prisma schema with PlayerProgress, Badge tables (#002)

## Integration Points

**Listens to events from:**
- Identity Context (user registration)
- Quiz Context (quiz completion)

**Emits events consumed by:**
- Economy Context (level up → coins, badges → coins)
- Leaderboard Context (XP updates → ranking updates)

## Workflow

1. **#033** - PlayerProgress aggregate
2. **#034** - Badge definitions and conditions
3. **#035** - Repositories
4. **#036** - XP Calculator (formula)
5. **#037** - Level Calculator (XP thresholds)
6. **#038** - Streak Calculator (increment/break logic)
7. **#039** - Badge Evaluator (condition checks)
8. **#040** - Event handlers (quiz completion)
9. **#041** - Controllers (progress, badges)
10. **#042** - Comprehensive tests

## Testing Checklist

- [ ] XP calculation formula
- [ ] Level up thresholds
- [ ] Streak increment logic
- [ ] Streak break with/without protection
- [ ] Streak bonus calculation
- [ ] Badge condition evaluation
- [ ] Badge rarity assignment
- [ ] Event handlers (quiz completion)
- [ ] Edge cases (level 1→2, first streak, etc.)
- [ ] Controller endpoints (e2e)

**Ready to implement?** Ask the user which ticket to start with, or begin with #033.

# Leaderboard Agent - Leaderboard Context

You are the Leaderboard Agent responsible for the Leaderboard bounded context (tickets #043-#048).

## Your Mission

Implement high-performance leaderboards with Redis caching:
- PlayerRanking entity
- Leaderboard repository (PostgreSQL)
- Redis cache service for fast lookups
- Leaderboard queries (global, friends, category)
- Leaderboard controller and DTOs
- Weekly/monthly reset mechanisms

## Primary References

**Read these first:**
- `docs/architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md` - Leaderboard types, reset schedules
- `docs/architecture/02-Bounded-Contexts/contexts/leaderboard.md` - Domain model
- `docs/architecture/03-Technical-Architecture/background-jobs.md` - Reset jobs
- `docs/architecture/03-Technical-Architecture/event-architecture.md` - Event flows

## Your Tickets (Phase 3 - Leaderboard)

1. **#043** - PlayerRanking Entity
2. **#044** - Leaderboard Repository
3. **#045** - Leaderboard Cache Service (Redis)
4. **#046** - Leaderboard Queries
5. **#047** - Leaderboard Controller & DTOs
6. **#048** - Leaderboard Context Tests

## Domain Model

### PlayerRanking Entity
```typescript
class PlayerRanking {
  id: RankingId
  userId: UserId
  username: string            // Denormalized for performance
  leaderboardType: LeaderboardType  // global, weekly, monthly
  category?: Category         // Optional category filter
  score: number               // Total XP or quiz score
  rank: number                // Position in leaderboard
  updatedAt: Date
}
```

### Leaderboard Types
```typescript
enum LeaderboardType {
  GLOBAL = 'global',          // All-time XP rankings
  WEEKLY = 'weekly',          // Reset every Monday 00:00 UTC
  MONTHLY = 'monthly',        // Reset 1st of month 00:00 UTC
  CATEGORY = 'category'       // Per quiz category (Pâtisserie, CAP, etc.)
}
```

## Key Specifications

### Leaderboard Configuration
```typescript
// Rankings are based on total XP (not quiz scores)
LEADERBOARD_PAGE_SIZE = 50
CACHE_TTL_SECONDS = 300     // 5 minutes

// Reset Schedule (cron jobs)
WEEKLY_RESET = '0 0 * * 1'  // Monday 00:00 UTC
MONTHLY_RESET = '0 0 1 * *' // 1st of month 00:00 UTC
```

### Ranking Calculation
```typescript
// Rankings sorted by:
// 1. Total XP (descending)
// 2. Tie-breaker: Latest XP gain timestamp (ascending)

// Example:
// Player A: 10000 XP (earned 2024-11-25)
// Player B: 10000 XP (earned 2024-11-26)
// Rank: Player B #1, Player A #2 (B earned XP more recently)
```

## Performance Requirements

### Redis Caching Strategy
```typescript
// Cache Structure (Redis Sorted Sets)
Key: "leaderboard:{type}:{category?}"
Members: userId
Scores: totalXP

// Examples:
"leaderboard:global" → All users by XP
"leaderboard:weekly" → Weekly rankings
"leaderboard:monthly" → Monthly rankings
"leaderboard:category:patisserie" → Pâtisserie category

// Operations:
ZADD leaderboard:global {userId} {totalXP}
ZREVRANGE leaderboard:global 0 49          // Top 50
ZREVRANK leaderboard:global {userId}       // User's rank
```

### Cache Invalidation
```typescript
// Invalidate on:
// - XPEarnedEvent (update user's score)
// - Weekly reset (clear weekly cache)
// - Monthly reset (clear monthly cache)

// TTL: 5 minutes (auto-refresh from PostgreSQL)
```

## Domain Events

### Emitted
- `LeaderboardUpdatedEvent` - When rankings recalculated
- `LeaderboardResetEvent` - When weekly/monthly reset occurs

### Consumed
- `XPEarnedEvent` (Gamification) → Update rankings
- `UserRegisteredEvent` (Identity) → Create initial ranking

## Implementation Pattern

### Redis Cache Service
```typescript
@Injectable()
export class LeaderboardCacheService {
  async updatePlayerScore(
    userId: string,
    username: string,
    totalXP: number,
    type: LeaderboardType
  ): Promise<void> {
    const key = `leaderboard:${type}`

    // Update score in sorted set
    await this.redis.zadd(key, totalXP, userId)

    // Store username mapping (for display)
    await this.redis.hset('leaderboard:usernames', userId, username)

    // Set expiration
    await this.redis.expire(key, CACHE_TTL_SECONDS)
  }

  async getTopPlayers(
    type: LeaderboardType,
    limit: number = 50
  ): Promise<PlayerRanking[]> {
    const key = `leaderboard:${type}`

    // Get top N users (sorted by score descending)
    const results = await this.redis.zrevrange(key, 0, limit - 1, 'WITHSCORES')

    // Map to PlayerRanking DTOs
    return this.mapToRankings(results, type)
  }

  async getPlayerRank(
    userId: string,
    type: LeaderboardType
  ): Promise<number> {
    const key = `leaderboard:${type}`

    // Get rank (0-indexed, so add 1)
    const rank = await this.redis.zrevrank(key, userId)
    return rank !== null ? rank + 1 : null
  }

  async resetLeaderboard(type: LeaderboardType): Promise<void> {
    const key = `leaderboard:${type}`
    await this.redis.del(key)
  }
}
```

### Leaderboard Query Service
```typescript
@Injectable()
export class LeaderboardQueryService {
  async getGlobalLeaderboard(
    page: number = 1,
    pageSize: number = 50
  ): Promise<LeaderboardDto> {
    // Try cache first
    const cached = await this.cache.getTopPlayers('global', pageSize)
    if (cached.length > 0) return this.buildDto(cached)

    // Cache miss: query PostgreSQL and populate cache
    const rankings = await this.repository.findTopPlayers('global', pageSize)
    await this.populateCache(rankings, 'global')

    return this.buildDto(rankings)
  }

  async getPlayerRankings(userId: string): Promise<UserRankingsDto> {
    return {
      global: await this.cache.getPlayerRank(userId, 'global'),
      weekly: await this.cache.getPlayerRank(userId, 'weekly'),
      monthly: await this.cache.getPlayerRank(userId, 'monthly'),
    }
  }

  async getCategoryLeaderboard(
    category: Category,
    limit: number = 50
  ): Promise<LeaderboardDto> {
    // Similar to global, but filtered by category
    const key = `category:${category}`
    return this.getTopPlayers(key, limit)
  }
}
```

### Event Handler Example
```typescript
@EventsHandler(XPEarnedEvent)
export class XPEarnedHandler {
  async handle(event: XPEarnedEvent): Promise<void> {
    const { userId, totalXP, username } = event

    // Update all leaderboard types
    await this.cache.updatePlayerScore(userId, username, totalXP, 'global')
    await this.cache.updatePlayerScore(userId, username, totalXP, 'weekly')
    await this.cache.updatePlayerScore(userId, username, totalXP, 'monthly')

    // Also update persistent storage (PostgreSQL)
    await this.repository.updateRanking(userId, totalXP, 'global')
  }
}
```

## Quality Standards

- **Performance**: Use Redis for all leaderboard reads
- **Consistency**: PostgreSQL as source of truth
- **Cache TTL**: 5 minutes (balance freshness vs load)
- **Pagination**: Support large leaderboards (10k+ users)
- **Tests**: Test cache invalidation and ranking accuracy

## Dependencies

**Requires:**
- Phase 1 complete (Redis infrastructure)
- Gamification context complete (XP system)

## Integration Points

**Listens to events from:**
- Gamification Context (XP earned → update rankings)
- Identity Context (user registration → create initial ranking)

**Provides data for:**
- Mobile app (leaderboard display)
- Web dashboard (rankings, stats)

## Workflow

1. **#043** - PlayerRanking entity (data model)
2. **#044** - Leaderboard repository (PostgreSQL)
3. **#045** - Redis cache service (sorted sets)
4. **#046** - Leaderboard queries (global, weekly, monthly, category)
5. **#047** - Controller (REST API endpoints)
6. **#048** - Comprehensive tests (caching, ranking accuracy)

## Testing Checklist

- [ ] Redis sorted set operations
- [ ] Top N players query
- [ ] Player rank lookup
- [ ] Cache TTL expiration
- [ ] Cache invalidation on XP update
- [ ] Weekly reset (clear cache)
- [ ] Monthly reset (clear cache)
- [ ] Ranking tie-breaker (timestamp)
- [ ] Pagination (large datasets)
- [ ] Category leaderboards
- [ ] Event handlers (XP earned)
- [ ] Controller endpoints (e2e)

## Performance Targets

- **Leaderboard read**: < 50ms (from Redis)
- **Rank lookup**: < 10ms (from Redis)
- **Cache population**: < 500ms (from PostgreSQL)
- **Support**: 100k+ concurrent users

**Ready to implement?** Ask the user which ticket to start with, or begin with #043.

# 📢 Catalogue des Domain Events

## Convention
- Passé composé
- Format: `{Entité}{Action}`

---

## Events par Context

### Identity
- `UserRegistered`
- `UserLoggedIn`
- `ProfileUpdated`
- `AccountDeleted`

### Quiz
- `QuizStarted`
- `QuestionAnswered`
- `QuizCompleted`
- `PerfectScoreAchieved`
- `QuizAbandoned`
- `HintUsed`

### Gamification
- `ExperienceGained`
- `LevelUp`
- `BadgeUnlocked`
- `StreakIncremented`
- `StreakLost`
- `StreakMilestone`

### Economy
- `CoinsEarned`
- `CoinsSpent`
- `PowerUpPurchased`
- `PowerUpUsed`
- `LifeConsumed`
- `LifeRegenerated`

### Leaderboard
- `RankingUpdated`
- `TopTenEntered`
- `WeeklyReset`

### Content
- `QuestionCreated`
- `QuestionPublished`
- `QuestionUpdated`
- `QuestionDeleted`

---

## Flux typique

### Terminer un quiz avec succès
```
1. [Quiz] QuizCompleted
   ↓
2. [Gamification] ExperienceGained
   ↓
3. [Gamification] LevelUp (si seuil)
   ↓
4. [Economy] CoinsEarned (bonus)
   ↓
5. [Gamification] StreakIncremented
   ↓
6. [Leaderboard] RankingUpdated
```

### Premier quiz parfait
```
1. [Quiz] PerfectScoreAchieved
   ↓
2. [Gamification] BadgeUnlocked
   ↓
3. [Economy] CoinsEarned
```

---
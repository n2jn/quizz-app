# 🏆 Bounded Context : Gamification

## Responsabilité
Gérer la progression du joueur : expérience, niveaux, badges, streaks.

---

## Vocabulaire

| Terme | Définition |
|-------|------------|
| Experience (XP) | Points d'expérience |
| Level | Niveau actuel |
| Badge | Récompense visuelle |
| Achievement | Condition de badge |
| Streak | Jours consécutifs |
| Milestone | Palier de streak |

---

## Agrégats

### PlayerProgress (Aggregate Root)
**Contient :**
- userId
- XP total
- Niveau actuel
- Badges débloqués
- Streak actuel
- Date du dernier quiz
- Statistiques (quiz joués, taux réussite, etc.)

**Règles :**
- Niveau calculé automatiquement selon XP
- Streak reset si > 24h sans quiz
- Badge débloqué = définitif

### Badge (Entity)
**Contient :**
- ID, nom, description
- Condition de déblocage
- Rareté (commun, rare, épique, légendaire)
- Récompense en coins

---

## Commandes

| Commande | Déclencheur |
|----------|-------------|
| AddExperience | QuizCompleted |
| CheckBadges | Toute action |
| UpdateStreak | QuizCompleted |
| ActivateStreakFreeze | Achat Economy |

---

## Événements émis

| Événement | Données |
|-----------|---------|
| ExperienceGained | userId, amount, newTotal |
| LevelUp | userId, newLevel |
| BadgeUnlocked | userId, badgeId, rarity |
| StreakIncremented | userId, newStreak |
| StreakLost | userId, previousStreak |
| StreakMilestone | userId, days |

---
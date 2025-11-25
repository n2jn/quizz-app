# 🗄️ Prisma Schema - PastryQuiz Backend

## Vue d'ensemble

Le schéma Prisma reflète notre architecture **DDD** avec 6 bounded contexts distincts.

```
Total Models: 23
Total Enums: 7
Database: PostgreSQL 15+
ORM: Prisma 5.x
```

---

## 📊 Modèles par Bounded Context

### 1. Identity Context (3 modèles)

**User** - Agrégat racine
- ID unique (UUID)
- Email unique
- Password hashé (bcrypt)
- Username unique
- Role (PLAYER, ADMIN, SUPER_ADMIN)

**RefreshToken**
- Gestion des refresh tokens JWT
- Expiration automatique
- Cascade delete si user supprimé

**Relations:**
- Un User a plusieurs RefreshTokens
- Un User a UNE PlayerProgress
- Un User a UN Wallet
- Un User a UNE Lives

---

### 2. Quiz Context (8 modèles)

**Category** - Catégories de questions
- Viennoiseries, Chocolat, Entremets, etc.
- Slug pour URLs friendly

**Difficulty** - Niveaux de difficulté
- Apprenti, Commis, Chef, MOF
- Temps par question configurable
- Multiplicateur XP

**Question** - Questions du quiz
- Texte de la question
- Explication de la réponse
- Image optionnelle
- Statut (DRAFT, PUBLISHED, ARCHIVED)

**Answer** - Réponses possibles
- 4 réponses par question
- Flag `isCorrect` pour la bonne réponse

**QuizSession** - Agrégat racine d'une partie
- Statut (CREATED, IN_PROGRESS, COMPLETED, ABANDONED)
- Score cumulé
- Timestamps (started, completed, expires)

**SessionAnswer** - Réponses données par le joueur
- Temps passé (validation anti-triche)
- Points gagnés + time bonus
- Unique constraint (une réponse par question)

**Relations:**
- QuizSession → User (joueur)
- QuizSession → Category (catégorie choisie)
- QuizSession → Difficulty (difficulté choisie)
- QuizSession → SessionAnswer[] (réponses données)
- Question → Category + Difficulty + Answers[]

---

### 3. Gamification Context (6 modèles)

**PlayerProgress** - Agrégat racine de progression
- XP total et niveau actuel
- Streak actuel et record
- Statistiques globales (quiz joués, taux de réussite)
- Date du dernier jeu (pour calcul streak)

**Badge** - Définition des badges
- Nom, description, image
- Rareté (COMMON, RARE, EPIC, LEGENDARY)
- Condition en JSON (flexibilité)
- Récompense en coins

**Exemples de conditions (JSON):**
```json
{
  "type": "perfect_quizzes",
  "count": 10
}

{
  "type": "streak",
  "days": 30
}

{
  "type": "category_answers",
  "category": "chocolat",
  "count": 50
}
```

**PlayerBadge** - Association User ↔ Badge
- Date de déblocage
- Unique constraint (un badge par user)

**CategoryStat** - Stats par catégorie
- Nombre de quiz joués
- Réponses correctes/totales
- Permet de calculer le taux de réussite par catégorie

**StreakProtection** - "Freeze" de streak
- Date d'expiration
- Permet de protéger le streak pour 1 jour

**Relations:**
- PlayerProgress → User (1-1)
- PlayerProgress → PlayerBadge[] (badges débloqués)
- PlayerProgress → CategoryStat[] (stats par catégorie)
- PlayerProgress → StreakProtection[] (protections actives)

---

### 4. Leaderboard Context (1 modèle)

**PlayerRanking** - Classements
- Score global (all-time)
- Score hebdomadaire (reset chaque lundi)
- Rang global et hebdomadaire
- Index sur les scores pour performance

**Optimisation:**
- Cache Redis pour les top 100
- Recalcul en batch (cron job)
- Ne stocke que les données nécessaires (projection)

**Relations:**
- PlayerRanking → User (1-1)

---

### 5. Economy Context (5 modèles)

**Wallet** - Agrégat racine du portefeuille
- Balance actuelle
- Total gagné (lifetime)
- Total dépensé (lifetime)

**Transaction** - Historique des transactions
- Type (EARNED, SPENT)
- Source (quiz_completed, level_up, etc.)
- Balance après transaction (audit)
- Index sur userId + createdAt pour performance

**ShopItem** - Items achetables
- Type (POWERUP, LIFE, STREAK_FREEZE)
- Prix en coins
- Flag `available` pour activer/désactiver

**Lives** - Système de vies
- Vies actuelles (max 5)
- Timestamp de dernière régénération
- Régénération gérée par cron job

**Relations:**
- Wallet → User (1-1)
- Transaction → User (1-N)
- Lives → User (1-1)

---

### 6. Content Context (Admin)

**Inclus dans Quiz Context :**
- Question (avec status DRAFT/PUBLISHED)
- Relation createdBy vers User

---

## 🔗 Relations clés

### User (Hub central)
```
User
├── RefreshTokens[]
├── QuizSessions[]
├── PlayerProgress (1-1)
├── Wallet (1-1)
├── Lives (1-1)
├── Transactions[]
├── PlayerRanking (1-1)
└── CreatedQuestions[]
```

### QuizSession (Agrégat)
```
QuizSession
├── User
├── Category
├── Difficulty
└── SessionAnswers[]
    └── Question
```

### PlayerProgress (Agrégat)
```
PlayerProgress
├── User
├── PlayerBadges[]
│   └── Badge
├── CategoryStats[]
└── StreakProtections[]
```

---

## 📐 Index Stratégiques

### Performance Queries

**Pour les leaderboards :**
```prisma
@@index([globalScore])
@@index([weeklyScore])
@@index([globalRank])
```

**Pour la recherche de questions :**
```prisma
@@index([categoryId])
@@index([difficultyId])
@@index([status])
```

**Pour l'historique :**
```prisma
@@index([userId])
@@index([createdAt])
```

**Pour l'expiration :**
```prisma
@@index([expiresAt])
```

---

## 🔒 Contraintes d'intégrité

### Unique Constraints

```prisma
// Pas de doublons
User.email         @unique
User.username      @unique
RefreshToken.token @unique
Badge.name         @unique

// Un seul badge par user
PlayerBadge @@unique([userId, badgeId])

// Une seule réponse par question par session
SessionAnswer @@unique([sessionId, questionId])
```

### Cascade Deletes

```prisma
// Si User supprimé → cascade sur toutes ses données
RefreshToken    onDelete: Cascade
PlayerProgress  onDelete: Cascade
Wallet          onDelete: Cascade
Lives           onDelete: Cascade
Transaction     onDelete: Cascade
PlayerRanking   onDelete: Cascade

// Si QuizSession supprimé → cascade sur SessionAnswers
SessionAnswer   onDelete: Cascade

// Si Question supprimé → cascade sur Answers
Answer          onDelete: Cascade
```

---

## 🎯 Exemples de Queries Prisma

### 1. Créer un User avec relations

```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    username: 'john_doe',
    playerProgress: {
      create: {
        currentXP: 0,
        currentLevel: 1,
      }
    },
    wallet: {
      create: {
        balance: 0,
      }
    },
    lives: {
      create: {
        currentLives: 5,
        maxLives: 5,
      }
    }
  },
  include: {
    playerProgress: true,
    wallet: true,
    lives: true,
  }
});
```

### 2. Démarrer une QuizSession

```typescript
const session = await prisma.quizSession.create({
  data: {
    userId: user.id,
    categoryId: category.id,
    difficultyId: difficulty.id,
    status: 'IN_PROGRESS',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  },
  include: {
    category: true,
    difficulty: true,
  }
});
```

### 3. Enregistrer une réponse

```typescript
const answer = await prisma.sessionAnswer.create({
  data: {
    sessionId: session.id,
    questionId: question.id,
    answerId: selectedAnswer.id,
    isCorrect: selectedAnswer.isCorrect,
    timeSpent: 5000, // ms
    pointsEarned: 100,
    timeBonus: 250,
  }
});

// Mettre à jour le score de la session
await prisma.quizSession.update({
  where: { id: session.id },
  data: {
    score: {
      increment: answer.pointsEarned + answer.timeBonus
    }
  }
});
```

### 4. Ajouter de l'XP et vérifier Level Up

```typescript
const progress = await prisma.playerProgress.update({
  where: { userId: user.id },
  data: {
    currentXP: {
      increment: 500
    },
    totalQuizzes: {
      increment: 1
    }
  }
});

// Calculer nouveau niveau
const newLevel = calculateLevel(progress.currentXP);

if (newLevel > progress.currentLevel) {
  await prisma.playerProgress.update({
    where: { userId: user.id },
    data: {
      currentLevel: newLevel
    }
  });
  
  // Émettre événement LevelUp
  await eventEmitter.emit('LevelUp', { userId, oldLevel, newLevel });
}
```

### 5. Débloquer un badge

```typescript
// Vérifier si déjà débloqué
const existing = await prisma.playerBadge.findUnique({
  where: {
    userId_badgeId: {
      userId: user.id,
      badgeId: badge.id,
    }
  }
});

if (!existing) {
  await prisma.playerBadge.create({
    data: {
      userId: user.id,
      badgeId: badge.id,
    }
  });
  
  // Donner les coins de récompense
  await prisma.wallet.update({
    where: { userId: user.id },
    data: {
      balance: {
        increment: badge.coinReward
      },
      lifetimeEarned: {
        increment: badge.coinReward
      }
    }
  });
  
  // Créer transaction
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'EARNED',
      amount: badge.coinReward,
      source: 'badge_unlocked',
      description: `Badge "${badge.name}" unlocked`,
      balanceAfter: wallet.balance + badge.coinReward,
    }
  });
}
```

### 6. Leaderboard hebdomadaire

```typescript
const weeklyLeaderboard = await prisma.playerRanking.findMany({
  where: {
    weeklyScore: {
      gt: 0
    }
  },
  orderBy: {
    weeklyScore: 'desc'
  },
  take: 100,
  include: {
    user: {
      select: {
        username: true,
        avatarUrl: true,
      }
    }
  }
});
```

### 7. Mettre à jour les stats par catégorie

```typescript
await prisma.categoryStat.upsert({
  where: {
    userId_categoryName: {
      userId: user.id,
      categoryName: 'chocolat',
    }
  },
  create: {
    userId: user.id,
    categoryName: 'chocolat',
    quizzesPlayed: 1,
    correctAnswers: 8,
    totalAnswers: 10,
  },
  update: {
    quizzesPlayed: {
      increment: 1
    },
    correctAnswers: {
      increment: 8
    },
    totalAnswers: {
      increment: 10
    }
  }
});
```

### 8. Transaction atomique (achat de vie)

```typescript
await prisma.$transaction(async (tx) => {
  // Vérifier le solde
  const wallet = await tx.wallet.findUnique({
    where: { userId: user.id }
  });
  
  if (wallet.balance < 300) {
    throw new Error('Insufficient coins');
  }
  
  // Débiter les coins
  await tx.wallet.update({
    where: { userId: user.id },
    data: {
      balance: {
        decrement: 300
      },
      lifetimeSpent: {
        increment: 300
      }
    }
  });
  
  // Ajouter la vie
  await tx.lives.update({
    where: { userId: user.id },
    data: {
      currentLives: {
        increment: 1
      }
    }
  });
  
  // Créer la transaction
  await tx.transaction.create({
    data: {
      userId: user.id,
      type: 'SPENT',
      amount: 300,
      source: 'life_purchase',
      description: 'Purchased 1 life',
      balanceAfter: wallet.balance - 300,
    }
  });
});
```

---

## 🚀 Migrations Prisma

### Commandes utiles

```bash
# Créer une migration
npx prisma migrate dev --name init

# Appliquer les migrations en production
npx prisma migrate deploy

# Reset la DB (dev only)
npx prisma migrate reset

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (GUI)
npx prisma studio
```

### Ordre d'exécution recommandé

1. **Migration initiale** - Toutes les tables
2. **Seed data** - Catégories, Difficultés, Badges
3. **Test data** (dev) - Questions, Users de test

---

## 📝 Seed Data

### Categories à seed

```typescript
const categories = [
  { name: 'Viennoiseries', slug: 'viennoiseries', icon: '🥐' },
  { name: 'Chocolat & Confiserie', slug: 'chocolat', icon: '🍫' },
  { name: 'Entremets', slug: 'entremets', icon: '🍰' },
  { name: 'Tartes & Tartelettes', slug: 'tartes', icon: '🥧' },
  { name: 'Pâtes de base', slug: 'pates', icon: '🥖' },
  { name: 'Crèmes & Mousses', slug: 'cremes', icon: '🍮' },
  { name: 'Techniques', slug: 'techniques', icon: '👨‍🍳' },
  { name: 'Culture pâtissière', slug: 'culture', icon: '📚' },
  { name: 'Ingrédients', slug: 'ingredients', icon: '🧈' },
  { name: 'Matériel', slug: 'materiel', icon: '🔪' },
];
```

### Difficulties à seed

```typescript
const difficulties = [
  { level: 'apprenti', name: 'Apprenti', timePerQuestion: 45, xpMultiplier: 1.0 },
  { level: 'commis', name: 'Commis', timePerQuestion: 30, xpMultiplier: 1.5 },
  { level: 'chef', name: 'Chef', timePerQuestion: 20, xpMultiplier: 2.0 },
  { level: 'mof', name: 'MOF', timePerQuestion: 15, xpMultiplier: 3.0 },
];
```

### Badges à seed

```typescript
const badges = [
  {
    name: 'Premier Pas',
    rarity: 'COMMON',
    coinReward: 25,
    conditionData: { type: 'quizzes_completed', count: 1 }
  },
  {
    name: 'Sans Faute',
    rarity: 'RARE',
    coinReward: 100,
    conditionData: { type: 'perfect_quizzes', count: 1 }
  },
  {
    name: 'Marathonien',
    rarity: 'EPIC',
    coinReward: 250,
    conditionData: { type: 'streak', days: 30 }
  },
  {
    name: 'Grand Maître',
    rarity: 'LEGENDARY',
    coinReward: 500,
    conditionData: { type: 'level', value: 50 }
  },
];
```

### Shop Items à seed

```typescript
const shopItems = [
  {
    type: 'POWERUP_FIFTY_FIFTY',
    name: '50/50',
    description: 'Retire 2 mauvaises réponses',
    price: 100,
  },
  {
    type: 'POWERUP_EXTRA_TIME',
    name: '+15 secondes',
    description: 'Ajoute 15 secondes au timer',
    price: 50,
  },
  {
    type: 'POWERUP_SKIP',
    name: 'Passer',
    description: 'Passe la question sans pénalité',
    price: 150,
  },
  {
    type: 'LIFE',
    name: 'Vie supplémentaire',
    description: '+1 vie immédiate',
    price: 300,
  },
  {
    type: 'STREAK_FREEZE',
    name: 'Protection Streak',
    description: 'Protège ton streak pour 1 jour',
    price: 200,
  },
];
```

---

## ✅ Validation du schéma

### Points de contrôle

- [x] Tous les bounded contexts représentés
- [x] Agrégats correctement définis
- [x] Relations 1-1, 1-N, N-N appropriées
- [x] Cascade deletes configurés
- [x] Index sur les colonnes fréquemment requêtées
- [x] Unique constraints pour éviter doublons
- [x] Enums pour valeurs fixes
- [x] Timestamps (createdAt, updatedAt)
- [x] JSON pour flexibilité (conditionData)
- [x] Support Event Sourcing (optionnel)

---

## 🔄 Prochaines étapes

1. ✅ Schéma Prisma créé
2. ⏳ Créer les seeds
3. ⏳ Générer la migration initiale
4. ⏳ Structure NestJS (modules, services, repositories)
5. ⏳ Implémentation des Use Cases
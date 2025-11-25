# 🚀 API Design - PastryQuiz Backend

## Stack Technique

```yaml
Backend Framework: NestJS (TypeScript)
ORM: Prisma
Database: PostgreSQL 15+
Cache: Redis
Events: NestJS EventEmitter
Auth: JWT (@nestjs/jwt + @nestjs/passport)
Validation: class-validator + class-transformer
Documentation: Swagger (@nestjs/swagger)
Tests: Jest
```

---

## 📐 Principes de Design

### Structure d'URL
```
/api/{version}/{context}/{resource}/{action}

Exemples:
/api/v1/auth/register
/api/v1/quiz/start
/api/v1/quiz/{sessionId}/answer
```

### Codes HTTP Standardisés

| Code | Usage |
|------|-------|
| 200 | Succès |
| 201 | Ressource créée |
| 204 | Succès sans contenu |
| 400 | Validation échouée |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource introuvable |
| 409 | Conflit (email existe) |
| 422 | Règle métier violée |
| 500 | Erreur serveur |

### Format de Réponse

**Succès :**
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-25T10:30:00Z",
    "requestId": "abc123"
  }
}
```

**Erreur :**
```json
{
  "error": {
    "code": "INSUFFICIENT_LIVES",
    "message": "You don't have enough lives to start a quiz",
    "details": {
      "currentLives": 0,
      "required": 1,
      "nextRegenAt": "2025-11-25T11:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-11-25T10:30:00Z",
    "requestId": "abc123"
  }
}
```

### Pagination Standard
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## 🔐 Authentication

### Flow d'authentification

1. **Register/Login** → JWT + Refresh Token
2. **Requests** → `Authorization: Bearer {token}`
3. **Token expiré** → Refresh avec refresh token
4. **Logout** → Invalidation du refresh token

**Tokens :**
- Access Token: 15 minutes
- Refresh Token: 7 jours

---

## 📋 Endpoints par Context

### 1. Identity Context

#### Authentication

**POST /api/v1/auth/register**
```typescript
Body: {
  email: string;
  password: string;    // min 8 chars
  username: string;    // 3-20 chars
}

Response 201: {
  data: {
    userId: string;
    username: string;
    token: string;
    refreshToken: string;
  }
}

Errors:
  409 - Email already exists
  400 - Validation failed
```

**POST /api/v1/auth/login**
```typescript
Body: {
  email: string;
  password: string;
}

Response 200: {
  data: {
    userId: string;
    username: string;
    token: string;
    refreshToken: string;
  }
}

Errors:
  401 - Invalid credentials
```

**POST /api/v1/auth/refresh**
```typescript
Body: {
  refreshToken: string;
}

Response 200: {
  data: {
    token: string;
    refreshToken: string;
  }
}
```

**POST /api/v1/auth/logout**
```typescript
Headers: Authorization: Bearer {token}

Response 204: No Content
```

#### Profile

**GET /api/v1/users/me**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    userId: string;
    email: string;
    username: string;
    avatarUrl?: string;
    createdAt: string;
  }
}
```

**PATCH /api/v1/users/me**
```typescript
Headers: Authorization: Bearer {token}

Body: {
  username?: string;
  avatarUrl?: string;
}

Response 200: {
  data: {
    userId: string;
    username: string;
    avatarUrl?: string;
  }
}
```

**GET /api/v1/users/:userId/public**
```typescript
Response 200: {
  data: {
    userId: string;
    username: string;
    avatarUrl?: string;
    level: number;
    badges: number;
  }
}
```

---

### 2. Quiz Context

#### Session Management

**POST /api/v1/quiz/start**
```typescript
Headers: Authorization: Bearer {token}

Body: {
  category?: string;     // null = random
  difficulty: "apprenti" | "commis" | "chef" | "mof";
}

Response 201: {
  data: {
    sessionId: string;
    category: string;
    difficulty: string;
    totalQuestions: 10;
    currentQuestionIndex: 0;
    currentQuestion: {
      questionId: string;
      text: string;
      answers: [
        { id: string; text: string; },
        { id: string; text: string; },
        { id: string; text: string; },
        { id: string; text: string; }
      ];
      timeLimit: 30;
      imageUrl?: string;
    };
    expiresAt: string;
  }
}

Errors:
  422 - Insufficient lives
  400 - Invalid category or difficulty
```

**POST /api/v1/quiz/:sessionId/answer**
```typescript
Headers: Authorization: Bearer {token}

Body: {
  answerId: string;
  timeSpent: number;    // milliseconds
}

Response 200: {
  data: {
    correct: boolean;
    correctAnswerId: string;
    explanation: string;
    pointsEarned: number;
    timeBonus: number;
    currentScore: number;
    nextQuestion?: {
      questionId: string;
      text: string;
      answers: [...];
      timeLimit: 30;
    } | null;
  }
}

Errors:
  404 - Session not found
  422 - Session already completed
  422 - Time limit exceeded
  409 - Already answered this question
```

**POST /api/v1/quiz/:sessionId/hint**
```typescript
Headers: Authorization: Bearer {token}

Body: {
  hintType: "fifty_fifty" | "extra_time" | "skip";
}

Response 200: {
  data: {
    hintApplied: boolean;
    remainingAnswers?: string[];
    extraTime?: number;
  }
}

Errors:
  422 - Insufficient coins
  422 - Hint already used
  404 - Session not found
```

**POST /api/v1/quiz/:sessionId/abandon**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    sessionId: string;
    status: "abandoned";
    questionsAnswered: number;
    finalScore: number;
  }
}
```

**GET /api/v1/quiz/:sessionId/result**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    sessionId: string;
    category: string;
    difficulty: string;
    finalScore: number;
    correctAnswers: number;
    totalQuestions: 10;
    xpEarned: number;
    coinsEarned: number;
    perfectScore: boolean;
    newBadges: [
      { badgeId: string; name: string; rarity: string; }
    ];
    levelUp?: {
      oldLevel: number;
      newLevel: number;
    };
    completedAt: string;
  }
}
```

#### Metadata

**GET /api/v1/quiz/categories**
```typescript
Response 200: {
  data: {
    categories: [
      {
        id: string;
        name: string;
        description: string;
        questionCount: number;
        icon: string;
      }
    ]
  }
}
```

**GET /api/v1/quiz/difficulties**
```typescript
Response 200: {
  data: {
    difficulties: [
      {
        level: "apprenti";
        name: "Apprenti";
        timePerQuestion: 45;
        xpMultiplier: 1.0;
      }
    ]
  }
}
```

---

### 3. Gamification Context

#### Progress

**GET /api/v1/gamification/progress**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    userId: string;
    currentLevel: number;
    levelTitle: string;
    currentXP: number;
    xpForNextLevel: number;
    xpProgress: number;       // percentage 0-100
    totalQuizzes: number;
    perfectQuizzes: number;
    successRate: number;
    currentStreak: number;
    longestStreak: number;
    lastPlayedAt: string;
    streakProtected: boolean;
    streakExpiresAt: string;
  }
}
```

#### Badges

**GET /api/v1/gamification/badges**
```typescript
Headers: Authorization: Bearer {token}
Query: ?filter=unlocked|locked|all

Response 200: {
  data: {
    badges: [
      {
        badgeId: string;
        name: string;
        description: string;
        rarity: "common" | "rare" | "epic" | "legendary";
        imageUrl: string;
        unlocked: boolean;
        unlockedAt?: string;
        progress?: {
          current: number;
          required: number;
          percentage: number;
        };
        coinReward: number;
      }
    ]
  }
}
```

**GET /api/v1/gamification/badges/:badgeId**
```typescript
Response 200: {
  data: {
    badgeId: string;
    name: string;
    description: string;
    rarity: string;
    condition: string;
    imageUrl: string;
    unlocked: boolean;
    unlockedAt?: string;
    ownersCount: number;
  }
}
```

#### Statistics

**GET /api/v1/gamification/stats**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    totalQuizzes: number;
    totalCorrectAnswers: number;
    totalWrongAnswers: number;
    successRate: number;
    averageScore: number;
    perfectScores: number;
    categoriesPlayed: number;
    favoriteCategory: string;
    totalPlayTime: number;
    averageQuizTime: number;
  }
}
```

**GET /api/v1/gamification/stats/by-category**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    categories: [
      {
        category: string;
        quizzesPlayed: number;
        correctAnswers: number;
        totalAnswers: number;
        successRate: number;
      }
    ]
  }
}
```

---

### 4. Leaderboard Context

**GET /api/v1/leaderboard/weekly**
```typescript
Query: ?page=1&limit=100

Response 200: {
  data: {
    rankings: [
      {
        rank: number;
        userId: string;
        username: string;
        avatarUrl?: string;
        score: number;
        quizzesPlayed: number;
        isCurrentUser: boolean;
      }
    ];
    currentUser: {
      rank: number;
      score: number;
    };
    period: {
      start: string;
      end: string;
    };
  },
  meta: {
    total: number;
    page: number;
    limit: number;
  }
}
```

**GET /api/v1/leaderboard/global**
```typescript
Query: ?page=1&limit=100

Response 200: {
  // Same structure as weekly
}
```

**GET /api/v1/leaderboard/nearby**
```typescript
Headers: Authorization: Bearer {token}
Query: ?range=10

Response 200: {
  data: {
    rankings: [
      {
        rank: number;
        userId: string;
        username: string;
        score: number;
        isCurrentUser: boolean;
      }
    ]
  }
}
```

---

### 5. Economy Context

#### Wallet

**GET /api/v1/economy/wallet**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    userId: string;
    balance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
  }
}
```

**GET /api/v1/economy/wallet/transactions**
```typescript
Headers: Authorization: Bearer {token}
Query: ?page=1&limit=20&type=earned|spent|all

Response 200: {
  data: {
    transactions: [
      {
        transactionId: string;
        type: "earned" | "spent";
        amount: number;
        source: string;
        description: string;
        balanceAfter: number;
        createdAt: string;
      }
    ]
  },
  meta: {
    total: number;
    page: number;
    limit: number;
  }
}
```

#### Shop

**GET /api/v1/economy/shop**
```typescript
Response 200: {
  data: {
    items: [
      {
        itemId: string;
        type: "powerup" | "life" | "streak_freeze";
        name: string;
        description: string;
        price: number;
        imageUrl: string;
        available: boolean;
      }
    ]
  }
}
```

**POST /api/v1/economy/shop/purchase**
```typescript
Headers: Authorization: Bearer {token}

Body: {
  itemId: string;
  quantity?: number;    // default: 1
}

Response 200: {
  data: {
    transactionId: string;
    itemId: string;
    quantity: number;
    totalCost: number;
    newBalance: number;
  }
}

Errors:
  422 - Insufficient coins
  404 - Item not found
  422 - Item not available
```

#### Lives

**GET /api/v1/economy/lives**
```typescript
Headers: Authorization: Bearer {token}

Response 200: {
  data: {
    currentLives: number;
    maxLives: 5;
    nextRegenAt: string | null;
    regenRateMinutes: 30;
  }
}
```

**POST /api/v1/economy/lives/buy**
```typescript
Headers: Authorization: Bearer {token}

Body: {
  quantity: number;
}

Response 200: {
  data: {
    livesPurchased: number;
    coinSpent: number;
    newLives: number;
    newBalance: number;
  }
}
```

---

### 6. Content Context (Admin)

**GET /api/v1/admin/questions**
```typescript
Headers: Authorization: Bearer {admin_token}
Query: ?page=1&limit=20&status=draft|published|all&category=...

Response 200: {
  data: {
    questions: [
      {
        questionId: string;
        text: string;
        answers: [...];
        correctAnswerId: string;
        category: string;
        difficulty: string;
        explanation: string;
        status: "draft" | "published";
        createdBy: string;
        createdAt: string;
      }
    ]
  }
}
```

**POST /api/v1/admin/questions**
```typescript
Headers: Authorization: Bearer {admin_token}

Body: {
  text: string;
  answers: [
    { text: string },
    { text: string },
    { text: string },
    { text: string }
  ];
  correctAnswerIndex: number;
  category: string;
  difficulty: string;
  explanation: string;
  imageUrl?: string;
}

Response 201: {
  data: {
    questionId: string;
    status: "draft";
  }
}
```

**PATCH /api/v1/admin/questions/:questionId**
```typescript
Headers: Authorization: Bearer {admin_token}

Body: {
  text?: string;
  answers?: [...];
  // partial update
}

Response 200: {
  data: {
    questionId: string;
    // updated question
  }
}
```

**POST /api/v1/admin/questions/:questionId/publish**
```typescript
Headers: Authorization: Bearer {admin_token}

Response 200: {
  data: {
    questionId: string;
    status: "published";
  }
}
```

**DELETE /api/v1/admin/questions/:questionId**
```typescript
Headers: Authorization: Bearer {admin_token}

Response 204: No Content
```

---

## ⚡ Optimisations avec Redis

### Cache Strategy

```typescript
// Leaderboards (TTL: 5 minutes)
redis.get('leaderboard:weekly')
redis.get('leaderboard:global')

// Lives (TTL: jusqu'à régénération)
redis.get('lives:userId')

// Quiz sessions actives (TTL: 10 minutes)
redis.get('quiz:session:sessionId')

// Player progress (TTL: 1 minute)
redis.get('progress:userId')
```

---

## 📊 Récapitulatif

### Total Endpoints: ~35

| Context | Endpoints | Complexité |
|---------|-----------|------------|
| Identity | 6 | Simple |
| Quiz | 8 | Moyenne |
| Gamification | 5 | Simple |
| Leaderboard | 3 | Simple |
| Economy | 7 | Moyenne |
| Content (Admin) | 6 | Simple |

### Principes Appliqués

✅ RESTful avec ressources claires  
✅ Versioning (`/v1/`)  
✅ Codes HTTP standards  
✅ Format de réponse consistant  
✅ Gestion d'erreurs détaillée  
✅ Pagination pour les listes  
✅ Auth JWT  
✅ Swagger pour documentation auto  
✅ Cache Redis pour performance  
✅ Validation stricte des inputs  

---

## 🔒 Sécurité

### Mesures Appliquées

- JWT avec expiration courte (15min)
- Refresh tokens en base
- Blacklist des tokens lors du logout
- Rate limiting sur tous les endpoints
- Validation côté serveur (never trust client)
- Hash bcrypt pour les mots de passe
- CORS configuré
- Anti-triche: validation temps serveur

### Rate Limiting

```typescript
// Endpoints sensibles
POST /api/v1/auth/login        → 5 requêtes / minute
POST /api/v1/auth/register     → 3 requêtes / minute
POST /api/v1/quiz/start        → 10 requêtes / minute

// Endpoints normaux
GET /api/v1/**                 → 100 requêtes / minute
POST /api/v1/**                → 30 requêtes / minute
```

---

## 🧪 Tests Prévus

### Types de Tests

1. **Unit Tests** - Logique métier (domain/)
2. **Integration Tests** - API endpoints
3. **E2E Tests** - Flux complets
4. **Load Tests** - Performance sous charge

### Couverture Cible

- Domain layer: 100%
- Use cases: 90%
- Controllers: 80%
- Global: 85%

---

## 📝 Documentation

### Swagger Auto-généré

```
http://localhost:3000/api/docs
```

Toutes les routes documentées avec:
- Schémas de requête/réponse
- Codes d'erreur
- Exemples
- Authentification requise

---

## 🚀 Prochaines Étapes

1. ✅ Stack choisie
2. ✅ API Design complété
3. ⏳ Prisma Schema
4. ⏳ Structure NestJS
5. ⏳ Implémentation
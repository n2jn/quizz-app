# 🌱 Seed Setup Guide - PastryQuiz

## 📦 Ce qui est seedé

Le fichier `seed.ts` crée automatiquement :

### 1. **10 Catégories** 📁
- Viennoiseries
- Chocolat & Confiserie
- Entremets
- Tartes & Tartelettes
- Pâtes de base
- Crèmes & Mousses
- Techniques
- Culture pâtissière
- Ingrédients
- Matériel

### 2. **4 Difficultés** ⚡
- **Apprenti** : 45s par question, XP x1.0
- **Commis** : 30s par question, XP x1.5
- **Chef** : 20s par question, XP x2.0
- **MOF** : 15s par question, XP x3.0

### 3. **18 Badges** 🏅

**Common (4)** : Premier Pas, Curieux, Matinal, Noctambule  
**Rare (6)** : Sans Faute, Rapide, Chocolatier, Viennois, Polyvalent, Régulier  
**Epic (4)** : Marathonien, Expert, Perfectionniste, Encyclopédie  
**Legendary (4)** : Légende, Grand Maître, Imbattable, MOF

### 4. **5 Items de Shop** 🛒
- 50/50 (100 coins)
- +15 secondes (50 coins)
- Passer (150 coins)
- Vie supplémentaire (300 coins)
- Protection Streak (200 coins)

### 5. **2 Utilisateurs de test** 👤

**Admin** : `admin@pastryquiz.com` / `Admin123!`
- Rôle : ADMIN
- 10,000 coins de départ

**Test User** : `test@pastryquiz.com` / `Test123!`
- Rôle : PLAYER
- 1,000 coins de départ

### 6. **5 Questions d'exemple** ❓
Questions sur le chocolat en difficulté Apprenti

### 7. **3 Cron Jobs** ⏰
- Régénération des vies (toutes les 30 min)
- Reset du leaderboard hebdomadaire (tous les lundis)
- Mise à jour des streaks (tous les jours à minuit)

---

## 🚀 Installation

### 1. Configuration du package.json

Ajoute le script seed dans ton `package.json` :

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "scripts": {
    "seed": "npx prisma db seed"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/node": "^20.0.0",
    "bcrypt": "^5.1.1",
    "prisma": "^5.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. Installation des dépendances

```bash
npm install bcrypt
npm install -D @types/bcrypt ts-node
```

---

## 📂 Structure des fichiers

```
backend/
├── prisma/
│   ├── schema.prisma       # Schéma Prisma
│   ├── seed.ts             # Fichier seed (nouvel artifact)
│   └── migrations/         # Généré automatiquement
│
├── .env                    # Variables d'environnement
└── package.json            # Configuration npm
```

---

## ⚙️ Configuration .env

Crée un fichier `.env` à la racine :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pastryquiz?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# Redis (pour plus tard)
REDIS_HOST="localhost"
REDIS_PORT=6379
```

---

## 🗄️ Setup de la base de données

### 1. Créer la base de données PostgreSQL

```bash
# Via Docker (recommandé)
docker run --name pastryquiz-postgres \
  -e POSTGRES_USER=pastryquiz \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=pastryquiz \
  -p 5432:5432 \
  -d postgres:15

# Ou via psql directement
createdb pastryquiz
```

### 2. Générer la migration initiale

```bash
npx prisma migrate dev --name init
```

Cette commande va :
- Créer toutes les tables dans PostgreSQL
- Générer le client Prisma
- **Exécuter automatiquement le seed**

### 3. Vérifier que tout est OK

```bash
# Ouvrir Prisma Studio (interface visuelle)
npx prisma studio
```

Vérifie que tu vois :
- ✅ 10 catégories
- ✅ 4 difficultés
- ✅ 18 badges
- ✅ 5 shop items
- ✅ 2 users (admin + test)
- ✅ 5 questions

---

## 🔄 Re-seeder manuellement

Si tu veux re-exécuter le seed :

```bash
# Option 1 : Via le script npm
npm run seed

# Option 2 : Via Prisma directement
npx prisma db seed

# Option 3 : Reset complet (DANGER: efface tout)
npx prisma migrate reset
# Confirmation demandée, puis re-seed automatique
```

---

## 📝 Personnalisation du Seed

### Ajouter plus de questions

Édite `prisma/seed.ts` et ajoute dans le tableau `sampleQuestions` :

```typescript
{
  text: 'Nouvelle question ?',
  explanation: 'Explication détaillée',
  categoryId: category.id,
  difficultyId: difficulty.id,
  createdById: adminUser.id,
  status: 'PUBLISHED',
  answers: [
    { text: 'Réponse A', isCorrect: true },
    { text: 'Réponse B', isCorrect: false },
    { text: 'Réponse C', isCorrect: false },
    { text: 'Réponse D', isCorrect: false },
  ],
},
```

### Ajouter un nouveau badge

```typescript
{
  name: 'Nouveau Badge',
  description: 'Description du badge',
  imageUrl: '/badges/new-badge.png',
  rarity: 'RARE', // COMMON | RARE | EPIC | LEGENDARY
  condition: 'Description lisible',
  coinReward: 100,
  conditionData: {
    type: 'perfect_quizzes',
    count: 5,
  },
},
```

### Modifier les coins de départ

```typescript
// Dans la création de l'admin
wallet: {
  create: {
    balance: 10000, // ← Change ce nombre
  },
},
```

---

## ✅ Validation du Seed

### 1. Via Prisma Studio

```bash
npx prisma studio
```

Ouvre `http://localhost:5555` et vérifie chaque table.

### 2. Via psql

```bash
psql pastryquiz

# Compter les catégories
SELECT COUNT(*) FROM categories;
-- Expected: 10

# Compter les badges
SELECT COUNT(*) FROM badges;
-- Expected: 18

# Lister les users
SELECT email, username, role FROM users;
-- Expected: admin@pastryquiz.com, test@pastryquiz.com

# Vérifier les shop items
SELECT name, price FROM shop_items;
-- Expected: 5 items
```

### 3. Via TypeScript (test rapide)

Crée `test-seed.ts` :

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const categoryCount = await prisma.category.count();
  const badgeCount = await prisma.badge.count();
  const userCount = await prisma.user.count();
  const questionCount = await prisma.question.count();

  console.log({
    categories: categoryCount,    // Expected: 10
    badges: badgeCount,            // Expected: 18
    users: userCount,              // Expected: 2
    questions: questionCount,      // Expected: 5
  });
}

test().finally(() => prisma.$disconnect());
```

Exécute :
```bash
npx ts-node test-seed.ts
```

---

## 🐛 Troubleshooting

### Erreur : "bcrypt not found"

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

### Erreur : "ts-node not found"

```bash
npm install -D ts-node @types/node
```

### Erreur : "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### Erreur : "Database connection failed"

Vérifie ton `DATABASE_URL` dans `.env` :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

Teste la connexion :
```bash
psql "postgresql://user:password@localhost:5432/dbname"
```

### Le seed s'exécute deux fois

C'est normal avec `prisma migrate dev` - il exécute le seed automatiquement.
Si tu veux juste migrer sans seed :
```bash
npx prisma migrate deploy
```

### Erreur : "Unique constraint violation"

Le seed utilise `upsert` donc normalement pas de problème.
Si ça arrive quand même :
```bash
# Reset complet
npx prisma migrate reset
# Confirme et ça va re-seed proprement
```

---

## 📊 Données seedées en détail

### Catégories avec slugs

| Nom | Slug | Icon |
|-----|------|------|
| Viennoiseries | `viennoiseries` | 🥐 |
| Chocolat & Confiserie | `chocolat` | 🍫 |
| Entremets | `entremets` | 🍰 |
| Tartes & Tartelettes | `tartes` | 🥧 |
| Pâtes de base | `pates` | 🥖 |
| Crèmes & Mousses | `cremes` | 🍮 |
| Techniques | `techniques` | 👨‍🍳 |
| Culture pâtissière | `culture` | 📚 |
| Ingrédients | `ingredients` | 🧈 |
| Matériel | `materiel` | 🔪 |

### Badges par rareté

**COMMON (25 coins)** :
- Premier Pas
- Curieux
- Matinal
- Noctambule

**RARE (100-150 coins)** :
- Sans Faute
- Rapide
- Chocolatier
- Viennois
- Polyvalent
- Régulier

**EPIC (250 coins)** :
- Marathonien (30 jours streak)
- Expert (niveau 20)
- Perfectionniste (10 quiz parfaits)
- Encyclopédie (500 bonnes réponses)

**LEGENDARY (500 coins)** :
- Légende (100 jours streak)
- Grand Maître (niveau 50)
- Imbattable (50 quiz parfaits)
- MOF (quiz parfait en difficulté MOF)

---

## 🎯 Prochaines étapes

Après le seed :

1. ✅ Base de données prête
2. ✅ Données de test créées
3. ⏳ Structure NestJS (modules, services, controllers)
4. ⏳ Implémentation des endpoints API
5. ⏳ Tests

Tu es maintenant prêt à commencer le développement du backend NestJS ! 🚀
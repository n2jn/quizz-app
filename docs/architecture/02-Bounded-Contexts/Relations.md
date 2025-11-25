# 🔗 Relations entre Bounded Contexts

## Types de relations utilisées

### 1. Identity → Tous (Upstream)
**Type :** Customer-Supplier

Identity est le fournisseur d'identité pour tous les autres contextes.
Les autres contextes dépendent de lui mais ne l'influencent pas.

**Données partagées :**
- `userId` (identifiant unique)
- `username` (pour affichage)

**Pas partagé :**
- Email, mot de passe (restent dans Identity)

---

### 2. Quiz → Gamification (Events)
**Type :** Publisher-Subscriber

Quiz publie des événements, Gamification écoute et réagit.
Aucun couplage direct. Quiz ne sait pas que Gamification existe.

**Événements :**
- `QuizStarted` → Gamification vérifie si c'est le premier du jour
- `QuizCompleted` → Gamification ajoute XP, vérifie badges
- `PerfectScoreAchieved` → Gamification donne bonus

---

### 3. Quiz → Leaderboard (Events)
**Type :** Publisher-Subscriber

**Événements :**
- `QuizCompleted` → Met à jour le score du joueur

---

### 4. Gamification → Economy (Events)
**Type :** Publisher-Subscriber

**Événements :**
- `LevelUp` → Economy donne des coins bonus
- `BadgeUnlocked` → Economy donne des coins selon rareté
- `StreakMilestone` → Economy donne des coins bonus

---

### 5. Economy → Quiz (Sync Call)
**Type :** Customer-Supplier

Quand un joueur utilise un power-up ou démarre un quiz, Quiz appelle Economy.

**Appels synchrones :**
- `hasEnoughLives(userId)` → Vérifie les vies disponibles
- `consumeLife(userId)` → Consomme une vie
- `usePowerUp(userId, type)` → Utilise un power-up

---

### 6. Content → Quiz (Shared Kernel)
**Type :** Shared Kernel

Content et Quiz partagent la définition d'une Question.

**Entité partagée :**
- Question (id, énoncé, réponses, catégorie, difficulté)

---

## Matrice des dépendances

| Context | Dépend de | Est utilisé par |
|---------|-----------|-----------------|
| Identity | - | Tous |
| Quiz | Identity, Content, Economy | Gamification, Leaderboard |
| Gamification | Identity, Quiz | Economy, Leaderboard |
| Leaderboard | Identity, Quiz, Gamification | - |
| Economy | Identity | Quiz, Gamification |
| Content | Identity | Quiz |

---
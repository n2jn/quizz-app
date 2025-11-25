# 🔐 Bounded Context : Identity

## Responsabilité
Gérer l'authentification, l'inscription et le profil utilisateur.

---

## Vocabulaire (Ubiquitous Language)

| Terme | Définition |
|-------|------------|
| User | Un utilisateur inscrit |
| Credentials | Email + mot de passe |
| Session | Connexion active |
| Token | JWT d'authentification |
| Profile | Informations publiques (username, avatar) |

---

## Agrégats

### User (Aggregate Root)
**Contient :**
- ID unique
- Email (unique)
- Mot de passe hashé
- Username
- Avatar (URL)
- Date d'inscription
- Dernière connexion
- Statut (actif, suspendu, supprimé)

**Règles métier :**
- Email unique dans le système
- Username : 3-20 caractères, alphanumériques
- Mot de passe : minimum 8 caractères

---

## Commandes

| Commande | Description |
|----------|-------------|
| Register | Créer un nouveau compte |
| Login | Se connecter |
| Logout | Se déconnecter |
| UpdateProfile | Modifier username/avatar |
| ChangePassword | Changer mot de passe |
| DeleteAccount | Supprimer le compte |

---

## Queries

| Query | Description |
|-------|-------------|
| GetCurrentUser | Utilisateur connecté |
| GetPublicProfile | Profil public d'un user |
| CheckUsernameAvailability | Vérifier disponibilité |

---

## Événements émis

| Événement | Données |
|-----------|---------|
| QuizStarted | userId, sessionId, category, difficulty |
| QuestionAnswered | sessionId, questionId, correct, timeMs |
| QuizCompleted | userId, score, correctCount, category, difficulty |
| PerfectScoreAchieved | userId, sessionId, category |
| QuizAbandoned | userId, sessionId, reason |
| HintUsed | sessionId, hintType |

---

## Événements consommés

| Événement | Source | Action |
|-----------|--------|--------|
| PowerUpActivated | Economy | Active le bonus |
| LifeAvailable | Economy | Autorise démarrage |

---
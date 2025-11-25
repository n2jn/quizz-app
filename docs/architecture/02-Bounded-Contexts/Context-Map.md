# 🗺️ Context Map - PastryQuiz

## Vue d'ensemble

Notre domaine se découpe en **6 bounded contexts** :

| Context | Responsabilité | Criticité | Équipe |
|---------|---------------|-----------|--------|
| **Identity** | Authentification, profil utilisateur | Haute | Core |
| **Quiz** | Moteur de quiz, questions, scoring | Haute | Core |
| **Gamification** | XP, niveaux, badges, streaks | Moyenne | Core |
| **Leaderboard** | Classements, rankings | Basse | Core |
| **Economy** | Coins, achats, power-ups, vies | Moyenne | Core |
| **Content** | Gestion des questions (admin) | Basse | Admin |

---

## Schéma des contextes

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    ┌──────────┐         ┌──────────┐         ┌──────────┐      │
│    │          │         │          │         │          │      │
│    │ IDENTITY │────────▶│   QUIZ   │────────▶│GAMIFICA- │      │
│    │          │ userId  │  ENGINE  │ events  │  TION    │      │
│    └──────────┘         └────┬─────┘         └────┬─────┘      │
│                              │                    │             │
│                              │ events             │ events      │
│                              ▼                    ▼             │
│    ┌──────────┐         ┌──────────┐         ┌──────────┐      │
│    │          │         │          │         │          │      │
│    │ CONTENT  │────────▶│  LEADER  │◀────────│ ECONOMY  │      │
│    │ (admin)  │questions│  BOARD   │         │          │      │
│    └──────────┘         └──────────┘         └──────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Règles de découpage appliquées

### Pourquoi séparer Quiz et Gamification ?
- **Quiz** = règles du jeu (questions, temps, scoring immédiat)
- **Gamification** = progression long terme (XP, niveaux, badges)
- Un quiz pourrait exister sans gamification (mode entraînement)
- La gamification pourrait s'appliquer à d'autres activités

### Pourquoi séparer Gamification et Leaderboard ?
- **Gamification** = progression personnelle (moi vs moi-même)
- **Leaderboard** = compétition sociale (moi vs les autres)
- Le leaderboard a des besoins techniques différents (cache, calcul batch)
- Un joueur peut désactiver le leaderboard mais garder sa progression

### Pourquoi séparer Economy ?
- Logique transactionnelle stricte (pas de solde négatif)
- Pourrait être externalisé (système de paiement)
- Réutilisable pour d'autres fonctionnalités (shop, premium)

### Pourquoi séparer Content ?
- Interface admin différente de l'app joueur
- Cycle de vie différent (création vs consommation)
- Équipe potentiellement différente (rédacteurs vs devs)

---
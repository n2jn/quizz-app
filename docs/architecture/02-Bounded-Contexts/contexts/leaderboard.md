# 🏅 Bounded Context : Leaderboard

## Responsabilité
Gérer les classements des joueurs (hebdomadaire, global).

---

## Vocabulaire

| Terme | Définition |
|-------|------------|
| Ranking | Classement d'un joueur |
| Period | Période (weekly, alltime) |
| Tier | Catégorie (bronze, silver, gold) |

---

## Agrégats

### PlayerRanking (Aggregate Root)
**Contient :**
- userId
- Score total (alltime)
- Score hebdomadaire
- Rang global
- Rang hebdomadaire
- Dernière mise à jour

**Règles :**
- Reset hebdomadaire tous les lundis 00h00 UTC
- Top 100 seuls visibles
- Cache Redis pour performance

---

## Queries

| Query | Retour |
|-------|--------|
| GetWeeklyLeaderboard | Top 100 de la semaine |
| GetGlobalLeaderboard | Top 100 global |
| GetPlayerRank | Position du joueur |
| GetNearbyPlayers | Joueurs autour de soi |

---

## Événements consommés

| Événement | Source | Action |
|-----------|--------|--------|
| QuizCompleted | Quiz | Ajoute au score |

---
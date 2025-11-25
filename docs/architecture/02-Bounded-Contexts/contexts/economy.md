# 💰 Bounded Context : Economy

## Responsabilité
Gérer la monnaie virtuelle, les achats, les power-ups et les vies.

---

## Vocabulaire

| Terme | Définition |
|-------|------------|
| Wallet | Portefeuille du joueur |
| Coins | Monnaie virtuelle |
| PowerUp | Bonus achetable |
| Life | Vie pour jouer |
| Transaction | Achat ou gain |

---

## Agrégats

### Wallet (Aggregate Root)
**Contient :**
- userId
- Solde de coins
- Historique des transactions
- Dernière transaction

**Règles :**
- Solde jamais négatif
- Transactions atomiques

### Lives (Aggregate Root)
**Contient :**
- userId
- Vies actuelles (max 5)
- Timestamp dernière régénération

**Règles :**
- Régénération : 1 vie / 30 min
- Maximum 5 vies

---

## Commandes

| Commande | Description |
|----------|-------------|
| AddCoins | Ajouter des coins |
| SpendCoins | Dépenser des coins |
| PurchasePowerUp | Acheter un bonus |
| UsePowerUp | Utiliser un bonus |
| ConsumeLife | Consommer une vie |
| BuyLife | Acheter une vie |
| RegenerateLives | Régénérer (cron) |

---

## Événements émis

| Événement | Données |
|-----------|---------|
| CoinsEarned | userId, amount, source |
| CoinsSpent | userId, amount, itemId |
| PowerUpPurchased | userId, type |
| PowerUpUsed | userId, type |
| LifeConsumed | userId, remaining |
| LifeRegenerated | userId, newTotal |

---

## Événements consommés

| Événement | Source | Action |
|-----------|--------|--------|
| LevelUp | Gamification | Donne 100 coins |
| BadgeUnlocked | Gamification | Donne coins |
| StreakMilestone | Gamification | Donne coins |
| QuizCompleted | Quiz | Donne 10 coins |
| PerfectScoreAchieved | Quiz | Donne 50 coins |

---
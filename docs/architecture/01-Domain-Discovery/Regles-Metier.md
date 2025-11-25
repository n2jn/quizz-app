# ⚖️ Règles métier

## Quiz

### Déroulement
- Un quiz contient exactement **10 questions**
- Temps par question : variable selon difficulté
- Une seule réponse possible par question
- Pas de retour en arrière une fois répondu
- Session expire après **10 minutes d'inactivité**

### Scoring
| Élément | Points |
|---------|--------|
| Bonne réponse | 100 points de base |
| Bonus temps | +10 points par seconde restante (max +300) |
| Mauvaise réponse | 0 point |
| Score parfait (10/10) | Bonus x1.5 sur le total |

### Difficulté

| Niveau | Temps/question | XP multiplier | Description |
|--------|----------------|---------------|-------------|
| Apprenti | 45s | x1 | Bases de la pâtisserie |
| Commis | 30s | x1.5 | Connaissances intermédiaires |
| Chef | 20s | x2 | Questions techniques |
| MOF | 15s | x3 | Niveau expert |

### Catégories
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

---

## Progression

### Calcul XP
```
XP = ScoreQuiz × MultiplierDifficulté × StreakBonus
```

**Streak Bonus :**
| Jours de streak | Bonus |
|-----------------|-------|
| 1-6 jours | x1.0 |
| 7-13 jours | x1.1 |
| 14-29 jours | x1.25 |
| 30+ jours | x1.5 |

### Niveaux

| Niveau | XP requis | Titre |
|--------|-----------|-------|
| 1 | 0 | Apprenti |
| 2 | 500 | Apprenti confirmé |
| 3 | 1 500 | Commis |
| 4 | 3 000 | Commis confirmé |
| 5 | 5 000 | Demi-chef |
| 10 | 15 000 | Chef de partie |
| 20 | 50 000 | Sous-chef |
| 30 | 100 000 | Chef pâtissier |
| 40 | 200 000 | Chef exécutif |
| 50 | 500 000 | Meilleur Ouvrier de France |

**Formule générale :**
```
XP_requis(n) = 250 × n × (n + 1)
```

---

## Streak

### Règles de base
- Un streak = nombre de jours consécutifs avec au moins 1 quiz terminé
- Reset à 0 si un jour est manqué
- Le jour change à **minuit** (timezone du joueur)

### Protection de streak
- "Streak Freeze" achetable : **200 coins**
- Protège le streak pour **1 jour**
- Maximum **2 freezes actifs** simultanément
- Ne peut pas être utilisé rétroactivement

### Milestones
| Jours | Récompense |
|-------|------------|
| 7 jours | 100 coins + Badge "Régulier" |
| 30 jours | 500 coins + Badge "Marathonien" |
| 100 jours | 2000 coins + Badge "Légende" |
| 365 jours | 10000 coins + Badge "Immortel" |

---

## Économie

### Gains de coins

| Action | Coins |
|--------|-------|
| Quiz terminé | 10 |
| Quiz parfait (10/10) | 50 |
| Level up | 100 |
| Badge commun débloqué | 25 |
| Badge rare débloqué | 100 |
| Badge épique débloqué | 250 |
| Badge légendaire débloqué | 500 |
| Streak 7 jours | 100 |
| Streak 30 jours | 500 |
| Streak 100 jours | 2000 |

### Dépenses

| Item | Coût | Effet |
|------|------|-------|
| 50/50 | 100 coins | Retire 2 mauvaises réponses |
| +15 secondes | 50 coins | Ajoute 15s au timer |
| Passer question | 150 coins | Passe sans pénalité |
| Streak Freeze | 200 coins | Protège le streak 1 jour |
| Vie supplémentaire | 300 coins | +1 vie immédiate |

### Vies

| Paramètre | Valeur |
|-----------|--------|
| Maximum | 5 vies |
| Régénération | 1 vie / 30 minutes |
| Coût par quiz | 1 vie |
| Achat | 300 coins = 1 vie |

**Règle importante :** Le solde de coins ne peut jamais être négatif.

---

## Badges

### Liste des badges

**Communs (25 coins)**
- "Premier Pas" : Terminer son premier quiz
- "Curieux" : Jouer dans 3 catégories différentes
- "Matinal" : Jouer avant 8h
- "Noctambule" : Jouer après 22h

**Rares (100 coins)**
- "Sans Faute" : Quiz parfait
- "Rapide" : Terminer un quiz en moins de 2 minutes
- "Chocolatier" : 50 bonnes réponses en Chocolat
- "Viennois" : 50 bonnes réponses en Viennoiseries
- "Polyvalent" : Quiz parfait dans 5 catégories

**Épiques (250 coins)**
- "Marathonien" : Streak de 30 jours
- "Expert" : Atteindre niveau 20
- "Perfectionniste" : 10 quiz parfaits
- "Encyclopédie" : 500 bonnes réponses total

**Légendaires (500 coins)**
- "Légende" : Streak de 100 jours
- "Grand Maître" : Atteindre niveau 50
- "Imbattable" : 50 quiz parfaits
- "MOF" : Quiz parfait en difficulté MOF

---
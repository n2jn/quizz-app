# 🎮 Bounded Context : Quiz

## Responsabilité
Gérer tout le cycle de vie d'un quiz : création de session, distribution des questions, validation des réponses, calcul du score.

---

## Vocabulaire (Ubiquitous Language)

| Terme | Définition |
|-------|------------|
| QuizSession | Une partie de quiz en cours |
| Question | Une question avec ses réponses |
| Answer | Réponse donnée par le joueur |
| Score | Points accumulés dans une session |
| TimeBonus | Points bonus pour réponse rapide |
| Category | Catégorie de questions |
| Difficulty | Niveau de difficulté |

---

## Agrégats

### QuizSession (Aggregate Root)
**Contient :**
- ID de session
- ID du joueur
- Liste des questions (10)
- Réponses données
- Score actuel
- Question courante (index)
- Temps de début
- Statut (created, in_progress, completed, abandoned)
- Catégorie choisie
- Difficulté choisie

**Règles métier :**
- Maximum 10 questions par session
- Une seule réponse par question
- Impossible de revenir en arrière
- Session expire après 10 minutes d'inactivité

**Cycle de vie :**
```
[Created] → [InProgress] → [Completed]
                 ↓
            [Abandoned]
```

### Question (Entity - partagée avec Content)
**Contient :**
- ID
- Énoncé
- Réponses possibles (4)
- Index bonne réponse
- Catégorie
- Difficulté
- Explication
- Image (optionnel)

---

## Commandes

| Commande | Description | Pré-conditions |
|----------|-------------|----------------|
| StartQuiz | Démarrer une session | Avoir des vies |
| SubmitAnswer | Soumettre une réponse | Session en cours, dans le temps |
| UseHint | Utiliser un indice | Avoir le power-up |
| AbandonQuiz | Abandonner | Session en cours |

---

## Queries

| Query | Retour |
|-------|--------|
| GetCurrentQuestion | Question + temps restant |
| GetQuizStatus | Score, progression |
| GetQuizResult | Résultat final |
| GetCategories | Liste des catégories |
| GetDifficulties | Liste des difficultés |

---

## Événements émis

| Évén
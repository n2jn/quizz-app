# 📂 Structure de documentation

Ce dossier contient toute la documentation d'architecture du projet PastryQuiz.

## Organisation

```
PastryQuiz-Architecture/
├── 00-Vision.md                    # Vision globale
├── 01-Domain-Discovery/            # Étape 1 : Comprendre le métier
│   ├── Glossaire.md
│   ├── Acteurs.md
│   ├── User-Stories.md
│   ├── Regles-Metier.md
│   └── Questions-Ouvertes.md
└── 02-Bounded-Contexts/            # Étape 2 : Découpage DDD
    ├── Context-Map.md
    ├── Relations.md
    ├── Domain-Events.md
    └── contexts/
        ├── identity.md
        ├── quiz.md
        ├── gamification.md
        ├── leaderboard.md
        ├── economy.md
        └── content.md
```

## Comment utiliser

1. Lis d'abord `00-Vision.md` pour comprendre le projet
2. Explore `01-Domain-Discovery/` pour le métier
3. Étudie `02-Bounded-Contexts/` pour l'architecture

## Prochaines étapes

- [ ] Étape 3 : Architecture technique
- [ ] Étape 4 : API Design
- [ ] Étape 5 : Data modeling
- [ ] Étape 6 : ADR (Architecture Decision Records)ement | Données |
|-----------|---------|
| UserRegistered | userId, username, email |
| UserLoggedIn | userId, timestamp |
| ProfileUpdated | userId, changes |
| AccountDeleted | userId |

---
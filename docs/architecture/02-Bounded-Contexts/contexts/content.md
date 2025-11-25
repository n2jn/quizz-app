# 📝 Bounded Context : Content

## Responsabilité
Gestion administrative des questions par l'équipe interne.

---

## Vocabulaire

| Terme | Définition |
|-------|------------|
| QuestionDraft | Question en cours de rédaction |
| Review | Processus de validation |
| Category | Catégorie de question |

---

## Agrégats

### QuestionDraft (Aggregate Root)
**Contient :**
- Énoncé en cours
- Réponses proposées
- Statut (draft, review, published, rejected)
- Auteur
- Reviewer

**Cycle de vie :**
```
[Draft] → [Review] → [Published]
            ↓
        [Rejected] → [Draft]
```

---

## Commandes

| Commande | Rôle requis |
|----------|-------------|
| CreateQuestion | Admin |
| UpdateQuestion | Admin |
| SubmitForReview | Admin |
| ApproveQuestion | Reviewer |
| RejectQuestion | Reviewer |
| PublishQuestion | Reviewer |
| DeleteQuestion | Admin |

---

## Événements émis

| Événement | Données |
|-----------|---------|
| QuestionCreated | questionId, category |
| QuestionPublished | questionId |
| QuestionUpdated | questionId, changes |
| QuestionDeleted | questionId |

---
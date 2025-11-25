# Ticket #019: Scoring Service

**Phase:** 2b - Quiz Context
**Context:** Quiz
**Priority:** High
**Depends On:** #013
**Estimated Time:** 2h
**Agent:** Quiz Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Scoring Formulas), business-rules-implementation.md`

---

## 🎯 Objectives

Implement scoring calculation service with all formulas.

---

## ✅ Deliverables

- [ ] ScoringService
- [ ] Base points calculation
- [ ] Difficulty multiplier
- [ ] Speed bonus calculation
- [ ] Perfect score detection
- [ ] Unit tests with all edge cases

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/quiz/domain/services/scoring.service.ts
apps/backend/src/modules/quiz/domain/services/__tests__/scoring.spec.ts
```

---

## 🧪 Acceptance Criteria

- [ ] All deliverables completed
- [ ] Tests pass (>90% coverage for domain layer)
- [ ] Follows Clean Architecture patterns
- [ ] Implements all specs from IMPLEMENTATION-SPECS.md
- [ ] No TypeScript errors
- [ ] Properly emits domain events

---

## 💡 Implementation Notes

Refer to IMPLEMENTATION-SPECS.md for:
- Constants and formulas
- Domain event signatures
- Validation rules
- Business logic specifications

---

## 🔗 Related Documentation

- Business Rules: `business-rules-implementation.md`
- Events: `event-architecture.md`
- Validation: `validation-and-security.md`

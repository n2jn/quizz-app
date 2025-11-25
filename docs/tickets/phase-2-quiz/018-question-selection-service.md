# Ticket #018: Question Selection Service

**Phase:** 2b - Quiz Context
**Context:** Quiz
**Priority:** Medium
**Depends On:** #015
**Estimated Time:** 2h
**Agent:** Quiz Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Question Selection)`

---

## 🎯 Objectives

Implement intelligent question selection algorithm.

---

## ✅ Deliverables

- [ ] QuestionSelectionService
- [ ] Random selection by category/difficulty
- [ ] Avoid recent questions logic
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/quiz/domain/services/question-selection.service.ts
apps/backend/src/modules/quiz/domain/services/__tests__/question-selection.spec.ts
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

# Ticket #038: Streak Calculator Service

**Phase:** 2d - Gamification Context
**Context:** Gamification
**Priority:** Medium
**Depends On:** #033
**Estimated Time:** 3h
**Agent:** Gamification Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Streak mechanics)`

---

## 🎯 Objectives

Implement daily streak calculation and management.

---

## ✅ Deliverables

- [ ] StreakCalculatorService
- [ ] updateStreak method
- [ ] Streak break detection
- [ ] Streak protection logic
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/gamification/domain/services/streak-calculator.service.ts
apps/backend/src/modules/gamification/domain/services/__tests__/streak-calculator.spec.ts
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

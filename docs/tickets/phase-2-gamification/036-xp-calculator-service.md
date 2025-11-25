# Ticket #036: XP Calculator Service

**Phase:** 2d - Gamification Context
**Context:** Gamification
**Priority:** High
**Depends On:** #033
**Estimated Time:** 2h
**Agent:** Gamification Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (XP formula), business-rules-implementation.md`

---

## 🎯 Objectives

Implement XP calculation service with all formulas.

---

## ✅ Deliverables

- [ ] XPCalculatorService
- [ ] calculateXP method (score × difficulty × streak)
- [ ] Difficulty multipliers
- [ ] Streak bonus calculation
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/gamification/domain/services/xp-calculator.service.ts
apps/backend/src/modules/gamification/domain/services/__tests__/xp-calculator.spec.ts
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

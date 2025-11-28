# Ticket #036: XP Calculator Service

**Phase:** 2d - Gamification Context
**Context:** Gamification
**Priority:** High
**Depends On:** #033
**Estimated Time:** 2h
**Agent:** Gamification Agent
**Status:** ✅ Complete

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

- [x] XPCalculatorService
- [x] calculateXP method (score × difficulty × streak)
- [x] Difficulty multipliers
- [x] Streak bonus calculation
- [x] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/gamification/domain/services/xp-calculator.service.ts
apps/backend/src/modules/gamification/domain/services/__tests__/xp-calculator.spec.ts
```

---

## 🧪 Acceptance Criteria

- [x] All deliverables completed
- [x] Tests pass (>90% coverage for domain layer)
- [x] Follows Clean Architecture patterns
- [x] Implements all specs from IMPLEMENTATION-SPECS.md
- [x] No TypeScript errors
- [x] Properly emits domain events

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

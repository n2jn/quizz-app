# Ticket #024: Lives Aggregate

**Phase:** 2c - Economy Context
**Context:** Economy
**Priority:** Critical
**Depends On:** #005
**Estimated Time:** 3h
**Agent:** Economy Agent
**Status:** ✅ Complete

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Lives system)`

---

## 🎯 Objectives

Implement Lives aggregate with regeneration logic.

---

## ✅ Deliverables

- [x] Lives aggregate
- [x] Consume life method
- [x] Regenerate lives method
- [x] Time-based regeneration logic
- [x] LifeConsumedEvent
- [x] LifeRegeneratedEvent
- [x] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/economy/domain/aggregates/lives.aggregate.ts
apps/backend/src/modules/economy/domain/events/*.event.ts
apps/backend/src/modules/economy/domain/aggregates/__tests__/lives.spec.ts
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

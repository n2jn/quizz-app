# Ticket #030: Economy Event Handlers

**Phase:** 2c - Economy Context
**Context:** Economy
**Priority:** High
**Depends On:** #027
**Estimated Time:** 4h
**Agent:** Economy Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `event-architecture.md (Economy handlers), IMPLEMENTATION-SPECS.md (Currency formulas)`

---

## 🎯 Objectives

Implement cross-context event handlers for economy.

---

## ✅ Deliverables

- [ ] QuizCompletedHandler (award currency)
- [ ] LevelUpHandler (award currency bonus)
- [ ] BadgeUnlockedHandler (award currency)
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/economy/application/event-handlers/*.handler.ts
apps/backend/src/modules/economy/application/event-handlers/__tests__/*.spec.ts
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

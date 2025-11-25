# Ticket #029: Lives Management Commands

**Phase:** 2c - Economy Context
**Context:** Economy
**Priority:** High
**Depends On:** #027
**Estimated Time:** 3h
**Agent:** Economy Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Lives mechanics)`

---

## 🎯 Objectives

Implement lives consumption and regeneration commands.

---

## ✅ Deliverables

- [ ] ConsumeLifeCommand
- [ ] ConsumeLifeHandler
- [ ] RegenerateLivesCommand
- [ ] RegenerateLivesHandler
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/economy/application/commands/consume-life/*.ts
apps/backend/src/modules/economy/application/commands/regenerate-lives/*.ts
apps/backend/src/modules/economy/application/commands/__tests__/*.spec.ts
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

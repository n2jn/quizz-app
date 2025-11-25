# Ticket #031: Economy Controllers

**Phase:** 2c - Economy Context
**Context:** Economy
**Priority:** High
**Depends On:** #028, #029
**Estimated Time:** 4h
**Agent:** Economy Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `api-design.md (Economy endpoints)`

---

## 🎯 Objectives

Implement REST API controllers for economy endpoints.

---

## ✅ Deliverables

- [ ] WalletController (get balance, history)
- [ ] ShopController (list items, purchase)
- [ ] LivesController (get status)
- [ ] DTOs with validation
- [ ] OpenAPI documentation
- [ ] Integration tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/economy/presentation/controllers/*.controller.ts
apps/backend/src/modules/economy/presentation/dtos/*.dto.ts
apps/backend/src/modules/economy/presentation/controllers/__tests__/*.spec.ts
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

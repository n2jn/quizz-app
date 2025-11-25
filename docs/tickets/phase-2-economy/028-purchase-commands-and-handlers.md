# Ticket #028: Purchase Commands & Handlers

**Phase:** 2c - Economy Context
**Context:** Economy
**Priority:** Medium
**Depends On:** #027
**Estimated Time:** 4h
**Agent:** Economy Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Shop mechanics)`

---

## 🎯 Objectives

Implement shop purchase commands.

---

## ✅ Deliverables

- [ ] PurchaseItemCommand
- [ ] PurchaseItemHandler
- [ ] Sufficient funds check
- [ ] Item application logic
- [ ] Transaction recording
- [ ] Emit ItemPurchasedEvent
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/economy/application/commands/purchase-item/purchase-item.command.ts
apps/backend/src/modules/economy/application/commands/purchase-item/purchase-item.handler.ts
apps/backend/src/modules/economy/application/commands/purchase-item/__tests__/purchase-item.spec.ts
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

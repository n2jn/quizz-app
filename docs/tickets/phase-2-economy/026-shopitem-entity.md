# Ticket #026: ShopItem Entity

**Phase:** 2c - Economy Context
**Context:** Economy
**Priority:** Low
**Depends On:** #023
**Estimated Time:** 1h
**Agent:** Economy Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Shop items)`

---

## 🎯 Objectives

Implement ShopItem entity for purchasable items.

---

## ✅ Deliverables

- [ ] ShopItem entity
- [ ] ItemType enum
- [ ] Validation logic
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/economy/domain/entities/shop-item.entity.ts
apps/backend/src/modules/economy/domain/entities/__tests__/shop-item.spec.ts
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

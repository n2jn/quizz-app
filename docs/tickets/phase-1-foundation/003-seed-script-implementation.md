# Ticket #003: Seed Script Implementation

**Phase:** 1 - Foundation
**Context:** Infrastructure
**Priority:** High
**Depends On:** #002
**Estimated Time:** 3h
**Agent:** Foundation Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `seed-instructions.md, IMPLEMENTATION-SPECS.md (Constants section)`

---

## 🎯 Objectives

Implement database seeding for categories, difficulties, badges, shop items, and test users.

---

## ✅ Deliverables

- [ ] Seed categories (10 items)
- [ ] Seed difficulties (4 items)
- [ ] Seed badges (18 items)
- [ ] Seed shop items (5 items)
- [ ] Create test users (admin + player)
- [ ] Create sample questions (5 items)

---

## 📁 Files to Create/Modify

```
apps/backend/prisma/seed.ts
apps/backend/package.json
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

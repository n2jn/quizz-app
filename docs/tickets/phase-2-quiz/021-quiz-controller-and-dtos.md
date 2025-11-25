# Ticket #021: Quiz Controller & DTOs

**Phase:** 2b - Quiz Context
**Context:** Quiz
**Priority:** High
**Depends On:** #016, #017
**Estimated Time:** 3h
**Agent:** Quiz Agent
**Status:** ⏳ Pending

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `api-design.md (Quiz endpoints), validation-and-security.md`

---

## 🎯 Objectives

Implement REST API controller for quiz endpoints.

---

## ✅ Deliverables

- [ ] QuizController (start, submit, get session)
- [ ] StartQuizDto
- [ ] SubmitAnswerDto
- [ ] Response DTOs
- [ ] JwtAuthGuard on all endpoints
- [ ] OpenAPI/Swagger documentation
- [ ] Integration tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/quiz/presentation/controllers/quiz.controller.ts
apps/backend/src/modules/quiz/presentation/dtos/*.dto.ts
apps/backend/src/modules/quiz/presentation/controllers/__tests__/quiz.controller.spec.ts
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

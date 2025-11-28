# Ticket #016: StartQuiz Command & Handler

**Phase:** 2b - Quiz Context
**Context:** Quiz
**Priority:** Critical
**Depends On:** #015
**Estimated Time:** 4h
**Agent:** Quiz Agent
**Status:** ✅ Complete

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Quiz Flow), business-rules-implementation.md`

---

## 🎯 Objectives

Implement quiz start command with question selection and session creation.

---

## ✅ Deliverables

- [x] StartQuizCommand
- [x] StartQuizHandler
- [x] Question selection logic (10 random questions)
- [x] Lives consumption check
- [x] Session creation
- [x] Emit QuizStartedEvent
- [x] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/quiz/application/commands/start-quiz/start-quiz.command.ts
apps/backend/src/modules/quiz/application/commands/start-quiz/start-quiz.handler.ts
apps/backend/src/modules/quiz/application/commands/start-quiz/__tests__/start-quiz.spec.ts
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

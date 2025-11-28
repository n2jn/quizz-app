# Ticket #017: SubmitAnswer Command & Handler

**Phase:** 2b - Quiz Context
**Context:** Quiz
**Priority:** Critical
**Depends On:** #015
**Estimated Time:** 5h
**Agent:** Quiz Agent
**Status:** ✅ Complete

---

## 📚 Specs Reference

- **Primary:** `../architecture/03-Technical-Architecture/IMPLEMENTATION-SPECS.md`
- **Patterns:** `application-architecture.md`
- **Reference:** `IMPLEMENTATION-SPECS.md (Scoring formulas), validation-and-security.md (Anti-cheat)`

---

## 🎯 Objectives

Implement answer submission with scoring, validation, and anti-cheat.

---

## ✅ Deliverables

- [x] SubmitAnswerCommand
- [x] SubmitAnswerHandler
- [x] Answer validation logic
- [x] Scoring calculation
- [x] Time validation (anti-cheat)
- [x] Session completion detection
- [x] Emit QuestionAnsweredEvent
- [x] Emit QuizCompletedEvent (on completion)
- [x] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/quiz/application/commands/submit-answer/submit-answer.command.ts
apps/backend/src/modules/quiz/application/commands/submit-answer/submit-answer.handler.ts
apps/backend/src/modules/quiz/application/commands/submit-answer/__tests__/submit-answer.spec.ts
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

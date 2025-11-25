# Ticket #016: StartQuiz Command & Handler

**Phase:** 2b - Quiz Context
**Context:** Quiz
**Priority:** Critical
**Depends On:** #015
**Estimated Time:** 4h
**Agent:** Quiz Agent
**Status:** ⏳ Pending

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

- [ ] StartQuizCommand
- [ ] StartQuizHandler
- [ ] Question selection logic (10 random questions)
- [ ] Lives consumption check
- [ ] Session creation
- [ ] Emit QuizStartedEvent
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/quiz/application/commands/start-quiz/start-quiz.command.ts
apps/backend/src/modules/quiz/application/commands/start-quiz/start-quiz.handler.ts
apps/backend/src/modules/quiz/application/commands/start-quiz/__tests__/start-quiz.spec.ts
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

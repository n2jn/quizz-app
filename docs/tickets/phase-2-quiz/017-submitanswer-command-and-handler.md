# Ticket #017: SubmitAnswer Command & Handler

**Phase:** 2b - Quiz Context
**Context:** Quiz
**Priority:** Critical
**Depends On:** #015
**Estimated Time:** 5h
**Agent:** Quiz Agent
**Status:** ⏳ Pending

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

- [ ] SubmitAnswerCommand
- [ ] SubmitAnswerHandler
- [ ] Answer validation logic
- [ ] Scoring calculation
- [ ] Time validation (anti-cheat)
- [ ] Session completion detection
- [ ] Emit QuestionAnsweredEvent
- [ ] Emit QuizCompletedEvent (on completion)
- [ ] Unit tests

---

## 📁 Files to Create/Modify

```
apps/backend/src/modules/quiz/application/commands/submit-answer/submit-answer.command.ts
apps/backend/src/modules/quiz/application/commands/submit-answer/submit-answer.handler.ts
apps/backend/src/modules/quiz/application/commands/submit-answer/__tests__/submit-answer.spec.ts
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

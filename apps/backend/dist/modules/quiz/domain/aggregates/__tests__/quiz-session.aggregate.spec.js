"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quiz_session_aggregate_1 = require("../quiz-session.aggregate");
describe('QuizSession Aggregate', () => {
    const sessionId = 'session-123';
    const userId = 'user-123';
    const categoryId = 'cat-123';
    const difficultyId = 'diff-123';
    const sessionDuration = 30;
    describe('create', () => {
        it('should create session with valid data', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            expect(session.id).toBe(sessionId);
            expect(session.userId).toBe(userId);
            expect(session.categoryId).toBe(categoryId);
            expect(session.difficultyId).toBe(difficultyId);
            expect(session.status).toBe(quiz_session_aggregate_1.SessionStatus.IN_PROGRESS);
            expect(session.score).toBe(0);
            expect(session.answers).toHaveLength(0);
        });
        it('should set expiration time correctly', () => {
            const beforeCreate = Date.now();
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            const afterCreate = Date.now();
            const expectedExpiry = beforeCreate + sessionDuration * 60 * 1000;
            const actualExpiry = session.expiresAt.getTime();
            expect(actualExpiry).toBeGreaterThanOrEqual(expectedExpiry - 100);
            expect(actualExpiry).toBeLessThanOrEqual(afterCreate + sessionDuration * 60 * 1000);
        });
        it('should emit QuizSessionStartedEvent', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            expect(session.domainEvents).toHaveLength(1);
            expect(session.domainEvents[0].eventName).toBe('quiz.session.started');
        });
        it('should accept null category', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, null, difficultyId, sessionDuration);
            expect(session.categoryId).toBeNull();
        });
    });
    describe('submitAnswer', () => {
        it('should add answer and update score', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.submitAnswer({
                questionId: 'q-1',
                answerId: 'a-1',
                isCorrect: true,
                timeSpent: 3000,
                pointsEarned: 100,
                timeBonus: 25,
            });
            expect(session.answers).toHaveLength(1);
            expect(session.score).toBe(125);
        });
        it('should throw error for duplicate question answer', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.submitAnswer({
                questionId: 'q-1',
                answerId: 'a-1',
                isCorrect: true,
                timeSpent: 3000,
                pointsEarned: 100,
                timeBonus: 25,
            });
            expect(() => session.submitAnswer({
                questionId: 'q-1',
                answerId: 'a-2',
                isCorrect: false,
                timeSpent: 5000,
                pointsEarned: 0,
                timeBonus: 0,
            })).toThrow('Answer already submitted for this question');
        });
        it('should throw error if session completed', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.complete();
            expect(() => session.submitAnswer({
                questionId: 'q-1',
                answerId: 'a-1',
                isCorrect: true,
                timeSpent: 3000,
                pointsEarned: 100,
                timeBonus: 25,
            })).toThrow('Cannot submit answer for completed or abandoned session');
        });
    });
    describe('complete', () => {
        it('should change status to COMPLETED', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.complete();
            expect(session.status).toBe(quiz_session_aggregate_1.SessionStatus.COMPLETED);
            expect(session.completedAt).not.toBeNull();
        });
        it('should emit QuizSessionCompletedEvent', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.submitAnswer({
                questionId: 'q-1',
                answerId: 'a-1',
                isCorrect: true,
                timeSpent: 3000,
                pointsEarned: 100,
                timeBonus: 25,
            });
            session.complete();
            const events = session.domainEvents;
            expect(events).toHaveLength(2);
            expect(events[1].eventName).toBe('quiz.session.completed');
        });
        it('should throw error if not in progress', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.complete();
            expect(() => session.complete()).toThrow('Session is not in progress');
        });
    });
    describe('abandon', () => {
        it('should change status to ABANDONED', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.abandon();
            expect(session.status).toBe(quiz_session_aggregate_1.SessionStatus.ABANDONED);
            expect(session.completedAt).not.toBeNull();
        });
        it('should throw error if not in progress', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.abandon();
            expect(() => session.abandon()).toThrow('Session is not in progress');
        });
    });
    describe('isExpired', () => {
        it('should return false for non-expired session', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            expect(session.isExpired()).toBe(false);
        });
    });
    describe('isInProgress', () => {
        it('should return true for active session', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            expect(session.isInProgress()).toBe(true);
        });
        it('should return false for completed session', () => {
            const session = quiz_session_aggregate_1.QuizSession.create(sessionId, userId, categoryId, difficultyId, sessionDuration);
            session.complete();
            expect(session.isInProgress()).toBe(false);
        });
    });
});
//# sourceMappingURL=quiz-session.aggregate.spec.js.map
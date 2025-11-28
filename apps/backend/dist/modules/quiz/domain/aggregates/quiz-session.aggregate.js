"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSession = exports.SessionStatus = void 0;
const aggregate_root_base_1 = require("../../../../shared/domain/base/aggregate-root.base");
const quiz_session_started_event_1 = require("../events/quiz-session-started.event");
const quiz_session_completed_event_1 = require("../events/quiz-session-completed.event");
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    SessionStatus["COMPLETED"] = "COMPLETED";
    SessionStatus["ABANDONED"] = "ABANDONED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
class QuizSession extends aggregate_root_base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    get userId() {
        return this.props.userId;
    }
    get categoryId() {
        return this.props.categoryId;
    }
    get difficultyId() {
        return this.props.difficultyId;
    }
    get status() {
        return this.props.status;
    }
    get score() {
        return this.props.score;
    }
    get answers() {
        return this.props.answers;
    }
    get startedAt() {
        return this.props.startedAt;
    }
    get completedAt() {
        return this.props.completedAt;
    }
    get expiresAt() {
        return this.props.expiresAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(id, userId, categoryId, difficultyId, sessionDurationMinutes) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + sessionDurationMinutes * 60 * 1000);
        const session = new QuizSession({
            id,
            userId,
            categoryId,
            difficultyId,
            status: SessionStatus.IN_PROGRESS,
            score: 0,
            answers: [],
            startedAt: now,
            completedAt: null,
            expiresAt,
            createdAt: now,
            updatedAt: now,
        });
        session.addDomainEvent(new quiz_session_started_event_1.QuizSessionStartedEvent({
            sessionId: id,
            userId,
            categoryId,
            difficultyId,
            occurredAt: now,
        }));
        return session;
    }
    submitAnswer(answer) {
        if (this.props.status !== SessionStatus.IN_PROGRESS) {
            throw new Error('Cannot submit answer for completed or abandoned session');
        }
        if (new Date() > this.props.expiresAt) {
            this.abandon();
            throw new Error('Session has expired');
        }
        const existingAnswer = this.props.answers.find((a) => a.questionId === answer.questionId);
        if (existingAnswer) {
            throw new Error('Answer already submitted for this question');
        }
        this.props.answers.push(answer);
        this.props.score += answer.pointsEarned + answer.timeBonus;
        this.props.updatedAt = new Date();
    }
    complete() {
        if (this.props.status !== SessionStatus.IN_PROGRESS) {
            throw new Error('Session is not in progress');
        }
        const now = new Date();
        this.props.status = SessionStatus.COMPLETED;
        this.props.completedAt = now;
        this.props.updatedAt = now;
        const correctAnswers = this.props.answers.filter((a) => a.isCorrect).length;
        const totalPoints = this.props.answers.reduce((sum, a) => sum + a.pointsEarned + a.timeBonus, 0);
        this.addDomainEvent(new quiz_session_completed_event_1.QuizSessionCompletedEvent({
            sessionId: this.props.id,
            userId: this.props.userId,
            categoryId: this.props.categoryId,
            difficultyId: this.props.difficultyId,
            score: this.props.score,
            totalQuestions: this.props.answers.length,
            correctAnswers,
            totalPoints,
            occurredAt: now,
        }));
    }
    abandon() {
        if (this.props.status !== SessionStatus.IN_PROGRESS) {
            throw new Error('Session is not in progress');
        }
        this.props.status = SessionStatus.ABANDONED;
        this.props.completedAt = new Date();
        this.props.updatedAt = new Date();
    }
    isExpired() {
        return new Date() > this.props.expiresAt;
    }
    isInProgress() {
        return this.props.status === SessionStatus.IN_PROGRESS && !this.isExpired();
    }
    static fromPersistence(props) {
        return new QuizSession(props);
    }
}
exports.QuizSession = QuizSession;
//# sourceMappingURL=quiz-session.aggregate.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionCompletedEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class QuizSessionCompletedEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('quiz.session.completed');
        this.props = props;
    }
    getAggregateId() {
        return this.props.sessionId;
    }
    get sessionId() {
        return this.props.sessionId;
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
    get score() {
        return this.props.score;
    }
    get totalQuestions() {
        return this.props.totalQuestions;
    }
    get correctAnswers() {
        return this.props.correctAnswers;
    }
    get totalPoints() {
        return this.props.totalPoints;
    }
    get isPerfectScore() {
        return this.props.correctAnswers === this.props.totalQuestions;
    }
}
exports.QuizSessionCompletedEvent = QuizSessionCompletedEvent;
//# sourceMappingURL=quiz-session-completed.event.js.map
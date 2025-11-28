"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSessionStartedEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class QuizSessionStartedEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('quiz.session.started');
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
}
exports.QuizSessionStartedEvent = QuizSessionStartedEvent;
//# sourceMappingURL=quiz-session-started.event.js.map
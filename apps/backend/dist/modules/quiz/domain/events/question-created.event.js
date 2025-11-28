"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCreatedEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class QuestionCreatedEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('question.created');
        this.props = props;
    }
    getAggregateId() {
        return this.props.questionId;
    }
    get questionId() {
        return this.props.questionId;
    }
    get categoryId() {
        return this.props.categoryId;
    }
    get difficultyId() {
        return this.props.difficultyId;
    }
    get createdById() {
        return this.props.createdById;
    }
}
exports.QuestionCreatedEvent = QuestionCreatedEvent;
//# sourceMappingURL=question-created.event.js.map
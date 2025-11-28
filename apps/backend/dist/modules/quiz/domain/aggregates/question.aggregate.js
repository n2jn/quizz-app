"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = exports.QuestionStatus = void 0;
const aggregate_root_base_1 = require("../../../../shared/domain/base/aggregate-root.base");
const question_created_event_1 = require("../events/question-created.event");
var QuestionStatus;
(function (QuestionStatus) {
    QuestionStatus["DRAFT"] = "DRAFT";
    QuestionStatus["PUBLISHED"] = "PUBLISHED";
    QuestionStatus["ARCHIVED"] = "ARCHIVED";
})(QuestionStatus || (exports.QuestionStatus = QuestionStatus = {}));
class Question extends aggregate_root_base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    get text() {
        return this.props.text;
    }
    get explanation() {
        return this.props.explanation;
    }
    get imageUrl() {
        return this.props.imageUrl;
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
    get createdById() {
        return this.props.createdById;
    }
    get answers() {
        return this.props.answers;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(id, text, explanation, categoryId, difficultyId, createdById, answers, imageUrl = null) {
        if (answers.length < this.MIN_ANSWERS || answers.length > this.MAX_ANSWERS) {
            throw new Error(`Question must have between ${this.MIN_ANSWERS} and ${this.MAX_ANSWERS} answers`);
        }
        const correctAnswers = answers.filter((a) => a.isCorrect);
        if (correctAnswers.length !== 1) {
            throw new Error('Question must have exactly one correct answer');
        }
        const question = new Question({
            id,
            text,
            explanation,
            imageUrl,
            categoryId,
            difficultyId,
            status: QuestionStatus.DRAFT,
            createdById,
            answers,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        question.addDomainEvent(new question_created_event_1.QuestionCreatedEvent({
            questionId: id,
            categoryId,
            difficultyId,
            createdById,
            occurredAt: new Date(),
        }));
        return question;
    }
    publish() {
        if (this.props.status === QuestionStatus.PUBLISHED) {
            throw new Error('Question is already published');
        }
        if (this.props.status === QuestionStatus.ARCHIVED) {
            throw new Error('Cannot publish archived question');
        }
        this.props.status = QuestionStatus.PUBLISHED;
        this.props.updatedAt = new Date();
    }
    archive() {
        if (this.props.status === QuestionStatus.ARCHIVED) {
            throw new Error('Question is already archived');
        }
        this.props.status = QuestionStatus.ARCHIVED;
        this.props.updatedAt = new Date();
    }
    isPublished() {
        return this.props.status === QuestionStatus.PUBLISHED;
    }
    static fromPersistence(props) {
        return new Question(props);
    }
}
exports.Question = Question;
Question.MIN_ANSWERS = 2;
Question.MAX_ANSWERS = 6;
//# sourceMappingURL=question.aggregate.js.map
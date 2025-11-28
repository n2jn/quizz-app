"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
const entity_base_1 = require("../../../../shared/domain/base/entity.base");
class Answer extends entity_base_1.Entity {
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    get text() {
        return this.props.text;
    }
    get isCorrect() {
        return this.props.isCorrect;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(id, text, isCorrect) {
        if (!text || text.trim().length === 0) {
            throw new Error('Answer text cannot be empty');
        }
        if (text.length > 255) {
            throw new Error('Answer text must not exceed 255 characters');
        }
        return new Answer({
            id,
            text: text.trim(),
            isCorrect,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    static fromPersistence(props) {
        return new Answer(props);
    }
}
exports.Answer = Answer;
//# sourceMappingURL=answer.entity.js.map
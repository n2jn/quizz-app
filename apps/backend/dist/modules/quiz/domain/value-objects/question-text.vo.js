"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionText = void 0;
const value_object_base_1 = require("../../../../shared/domain/base/value-object.base");
const exceptions_1 = require("../../../../shared/domain/exceptions");
class QuestionText extends value_object_base_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(text) {
        const trimmed = text?.trim();
        if (!trimmed) {
            throw new exceptions_1.InvalidArgumentException('Question text cannot be empty');
        }
        if (trimmed.length < this.MIN_LENGTH) {
            throw new exceptions_1.InvalidArgumentException(`Question text must be at least ${this.MIN_LENGTH} characters`);
        }
        if (trimmed.length > this.MAX_LENGTH) {
            throw new exceptions_1.InvalidArgumentException(`Question text must not exceed ${this.MAX_LENGTH} characters`);
        }
        return new QuestionText({ value: trimmed });
    }
}
exports.QuestionText = QuestionText;
QuestionText.MIN_LENGTH = 10;
QuestionText.MAX_LENGTH = 1000;
//# sourceMappingURL=question-text.vo.js.map
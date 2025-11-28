"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explanation = void 0;
const value_object_base_1 = require("../../../../shared/domain/base/value-object.base");
const exceptions_1 = require("../../../../shared/domain/exceptions");
class Explanation extends value_object_base_1.ValueObject {
    get value() {
        return this.props.value;
    }
    constructor(props) {
        super(props);
    }
    static create(text) {
        const trimmed = text?.trim();
        if (!trimmed) {
            throw new exceptions_1.InvalidArgumentException('Explanation cannot be empty');
        }
        if (trimmed.length < this.MIN_LENGTH) {
            throw new exceptions_1.InvalidArgumentException(`Explanation must be at least ${this.MIN_LENGTH} characters`);
        }
        if (trimmed.length > this.MAX_LENGTH) {
            throw new exceptions_1.InvalidArgumentException(`Explanation must not exceed ${this.MAX_LENGTH} characters`);
        }
        return new Explanation({ value: trimmed });
    }
}
exports.Explanation = Explanation;
Explanation.MIN_LENGTH = 20;
Explanation.MAX_LENGTH = 2000;
//# sourceMappingURL=explanation.vo.js.map
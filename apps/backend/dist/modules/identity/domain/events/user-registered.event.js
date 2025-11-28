"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisteredEvent = void 0;
const base_1 = require("../../../../shared/domain/base");
class UserRegisteredEvent extends base_1.DomainEvent {
    constructor(props) {
        super('user.registered');
        this.props = props;
    }
    getAggregateId() {
        return this.props.userId;
    }
}
exports.UserRegisteredEvent = UserRegisteredEvent;
//# sourceMappingURL=user-registered.event.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinsSpentEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class CoinsSpentEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('coins.spent');
        this.props = props;
    }
    getAggregateId() {
        return this.props.userId;
    }
    get userId() {
        return this.props.userId;
    }
    get amount() {
        return this.props.amount;
    }
    get source() {
        return this.props.source;
    }
    get balanceAfter() {
        return this.props.balanceAfter;
    }
}
exports.CoinsSpentEvent = CoinsSpentEvent;
//# sourceMappingURL=coins-spent.event.js.map
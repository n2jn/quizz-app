"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinsEarnedEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class CoinsEarnedEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('coins.earned');
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
exports.CoinsEarnedEvent = CoinsEarnedEvent;
//# sourceMappingURL=coins-earned.event.js.map
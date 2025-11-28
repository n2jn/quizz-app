"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeConsumedEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class LifeConsumedEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('life.consumed');
        this.props = props;
    }
    getAggregateId() {
        return this.props.userId;
    }
    get userId() {
        return this.props.userId;
    }
    get livesRemaining() {
        return this.props.livesRemaining;
    }
}
exports.LifeConsumedEvent = LifeConsumedEvent;
//# sourceMappingURL=life-consumed.event.js.map
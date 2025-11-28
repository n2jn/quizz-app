"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeRestoredEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class LifeRestoredEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('life.restored');
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
    get isPurchased() {
        return this.props.isPurchased;
    }
}
exports.LifeRestoredEvent = LifeRestoredEvent;
//# sourceMappingURL=life-restored.event.js.map
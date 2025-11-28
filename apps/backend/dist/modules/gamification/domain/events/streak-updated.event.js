"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreakUpdatedEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class StreakUpdatedEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('player.streak_updated');
        this.props = props;
    }
    getAggregateId() {
        return this.props.userId;
    }
    get userId() {
        return this.props.userId;
    }
    get currentStreak() {
        return this.props.currentStreak;
    }
}
exports.StreakUpdatedEvent = StreakUpdatedEvent;
//# sourceMappingURL=streak-updated.event.js.map
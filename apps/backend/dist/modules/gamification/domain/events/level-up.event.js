"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelUpEvent = void 0;
const domain_event_base_1 = require("../../../../shared/domain/base/domain-event.base");
class LevelUpEvent extends domain_event_base_1.DomainEvent {
    constructor(props) {
        super('player.level_up');
        this.props = props;
    }
    getAggregateId() {
        return this.props.userId;
    }
    get userId() {
        return this.props.userId;
    }
    get newLevel() {
        return this.props.newLevel;
    }
}
exports.LevelUpEvent = LevelUpEvent;
//# sourceMappingURL=level-up.event.js.map
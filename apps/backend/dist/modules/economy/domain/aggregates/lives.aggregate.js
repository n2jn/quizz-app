"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lives = void 0;
const aggregate_root_base_1 = require("../../../../shared/domain/base/aggregate-root.base");
const life_consumed_event_1 = require("../events/life-consumed.event");
const life_restored_event_1 = require("../events/life-restored.event");
class Lives extends aggregate_root_base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    get userId() {
        return this.props.userId;
    }
    get currentLives() {
        return this.props.currentLives;
    }
    get maxLives() {
        return this.props.maxLives;
    }
    get lastRegenAt() {
        return this.props.lastRegenAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(id, userId, maxLives = 5) {
        return new Lives({
            id,
            userId,
            currentLives: maxLives,
            maxLives,
            lastRegenAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    consumeLife() {
        if (this.props.currentLives <= 0) {
            throw new Error('No lives available');
        }
        this.props.currentLives -= 1;
        this.props.updatedAt = new Date();
        if (this.props.currentLives < this.props.maxLives && !this.props.lastRegenAt) {
            this.props.lastRegenAt = new Date();
        }
        this.addDomainEvent(new life_consumed_event_1.LifeConsumedEvent({
            userId: this.props.userId,
            livesRemaining: this.props.currentLives,
            occurredAt: new Date(),
        }));
    }
    restoreLife(isPurchased = false) {
        if (!isPurchased && this.props.currentLives >= this.props.maxLives) {
            throw new Error('Lives already at maximum');
        }
        this.props.currentLives += 1;
        this.props.updatedAt = new Date();
        if (this.props.currentLives >= this.props.maxLives) {
            this.props.lastRegenAt = null;
        }
        else {
            this.props.lastRegenAt = new Date();
        }
        this.addDomainEvent(new life_restored_event_1.LifeRestoredEvent({
            userId: this.props.userId,
            livesRemaining: this.props.currentLives,
            isPurchased,
            occurredAt: new Date(),
        }));
    }
    regenerateLives() {
        if (this.props.currentLives >= this.props.maxLives) {
            return 0;
        }
        if (!this.props.lastRegenAt) {
            return 0;
        }
        const now = new Date();
        const minutesSinceRegen = (now.getTime() - this.props.lastRegenAt.getTime()) / (1000 * 60);
        const livesToRestore = Math.floor(minutesSinceRegen / Lives.REGEN_INTERVAL_MINUTES);
        if (livesToRestore === 0) {
            return 0;
        }
        const actualRestore = Math.min(livesToRestore, this.props.maxLives - this.props.currentLives);
        for (let i = 0; i < actualRestore; i++) {
            this.restoreLife(false);
        }
        return actualRestore;
    }
    hasLives() {
        return this.props.currentLives > 0;
    }
    static fromPersistence(props) {
        return new Lives(props);
    }
}
exports.Lives = Lives;
Lives.REGEN_INTERVAL_MINUTES = 30;
//# sourceMappingURL=lives.aggregate.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRanking = void 0;
const aggregate_root_base_1 = require("../../../../shared/domain/base/aggregate-root.base");
class PlayerRanking extends aggregate_root_base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    get userId() {
        return this.props.userId;
    }
    get globalScore() {
        return this.props.globalScore;
    }
    get weeklyScore() {
        return this.props.weeklyScore;
    }
    get globalRank() {
        return this.props.globalRank;
    }
    get weeklyRank() {
        return this.props.weeklyRank;
    }
    static create(id, userId) {
        return new PlayerRanking({
            id,
            userId,
            globalScore: 0,
            weeklyScore: 0,
            globalRank: null,
            weeklyRank: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    addScore(points) {
        this.props.globalScore += points;
        this.props.weeklyScore += points;
        this.props.updatedAt = new Date();
    }
    resetWeeklyScore() {
        this.props.weeklyScore = 0;
        this.props.updatedAt = new Date();
    }
    updateRank(globalRank, weeklyRank) {
        this.props.globalRank = globalRank;
        this.props.weeklyRank = weeklyRank;
        this.props.updatedAt = new Date();
    }
    static fromPersistence(props) {
        return new PlayerRanking(props);
    }
}
exports.PlayerRanking = PlayerRanking;
//# sourceMappingURL=player-ranking.aggregate.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerProgress = void 0;
const aggregate_root_base_1 = require("../../../../shared/domain/base/aggregate-root.base");
const level_up_event_1 = require("../events/level-up.event");
const streak_updated_event_1 = require("../events/streak-updated.event");
class PlayerProgress extends aggregate_root_base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    get userId() {
        return this.props.userId;
    }
    get currentXP() {
        return this.props.currentXP;
    }
    get currentLevel() {
        return this.props.currentLevel;
    }
    get currentStreak() {
        return this.props.currentStreak;
    }
    get longestStreak() {
        return this.props.longestStreak;
    }
    get totalQuizzes() {
        return this.props.totalQuizzes;
    }
    get perfectQuizzes() {
        return this.props.perfectQuizzes;
    }
    get totalCorrect() {
        return this.props.totalCorrect;
    }
    get totalAnswers() {
        return this.props.totalAnswers;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(id, userId) {
        return new PlayerProgress({
            id,
            userId,
            currentXP: 0,
            currentLevel: 1,
            currentStreak: 0,
            longestStreak: 0,
            totalQuizzes: 0,
            perfectQuizzes: 0,
            totalCorrect: 0,
            totalAnswers: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    addXP(amount) {
        if (amount <= 0)
            return;
        this.props.currentXP += amount;
        this.props.updatedAt = new Date();
        const newLevel = Math.floor(this.props.currentXP / PlayerProgress.XP_PER_LEVEL) + 1;
        if (newLevel > this.props.currentLevel) {
            this.props.currentLevel = newLevel;
            this.addDomainEvent(new level_up_event_1.LevelUpEvent({
                userId: this.props.userId,
                newLevel: newLevel,
                totalXP: this.props.currentXP,
                occurredAt: new Date(),
            }));
        }
    }
    recordQuizCompletion(correctAnswers, totalQuestions) {
        this.props.totalQuizzes += 1;
        this.props.totalCorrect += correctAnswers;
        this.props.totalAnswers += totalQuestions;
        if (correctAnswers === totalQuestions) {
            this.props.perfectQuizzes += 1;
        }
        this.props.updatedAt = new Date();
    }
    incrementStreak() {
        this.props.currentStreak += 1;
        if (this.props.currentStreak > this.props.longestStreak) {
            this.props.longestStreak = this.props.currentStreak;
        }
        this.props.updatedAt = new Date();
        this.addDomainEvent(new streak_updated_event_1.StreakUpdatedEvent({
            userId: this.props.userId,
            currentStreak: this.props.currentStreak,
            longestStreak: this.props.longestStreak,
            occurredAt: new Date(),
        }));
    }
    resetStreak() {
        this.props.currentStreak = 0;
        this.props.updatedAt = new Date();
    }
    get accuracy() {
        if (this.props.totalAnswers === 0)
            return 0;
        return (this.props.totalCorrect / this.props.totalAnswers) * 100;
    }
    static fromPersistence(props) {
        return new PlayerProgress(props);
    }
}
exports.PlayerProgress = PlayerProgress;
PlayerProgress.XP_PER_LEVEL = 1000;
//# sourceMappingURL=player-progress.aggregate.js.map
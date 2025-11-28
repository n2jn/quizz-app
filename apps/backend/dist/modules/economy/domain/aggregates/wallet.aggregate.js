"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.TransactionType = void 0;
const aggregate_root_base_1 = require("../../../../shared/domain/base/aggregate-root.base");
const coins_earned_event_1 = require("../events/coins-earned.event");
const coins_spent_event_1 = require("../events/coins-spent.event");
var TransactionType;
(function (TransactionType) {
    TransactionType["EARNED"] = "EARNED";
    TransactionType["SPENT"] = "SPENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
class Wallet extends aggregate_root_base_1.AggregateRoot {
    constructor(props) {
        super(props.id);
        this.props = props;
    }
    get userId() {
        return this.props.userId;
    }
    get balance() {
        return this.props.balance;
    }
    get lifetimeEarned() {
        return this.props.lifetimeEarned;
    }
    get lifetimeSpent() {
        return this.props.lifetimeSpent;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(id, userId) {
        return new Wallet({
            id,
            userId,
            balance: 0,
            lifetimeEarned: 0,
            lifetimeSpent: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    addCoins(amount, source, description) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        this.props.balance += amount;
        this.props.lifetimeEarned += amount;
        this.props.updatedAt = new Date();
        this.addDomainEvent(new coins_earned_event_1.CoinsEarnedEvent({
            userId: this.props.userId,
            amount,
            source,
            description: description || null,
            balanceAfter: this.props.balance,
            occurredAt: new Date(),
        }));
    }
    spendCoins(amount, source, description) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (this.props.balance < amount) {
            throw new Error('Insufficient balance');
        }
        this.props.balance -= amount;
        this.props.lifetimeSpent += amount;
        this.props.updatedAt = new Date();
        this.addDomainEvent(new coins_spent_event_1.CoinsSpentEvent({
            userId: this.props.userId,
            amount,
            source,
            description: description || null,
            balanceAfter: this.props.balance,
            occurredAt: new Date(),
        }));
    }
    hasBalance(amount) {
        return this.props.balance >= amount;
    }
    static fromPersistence(props) {
        return new Wallet(props);
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.aggregate.js.map
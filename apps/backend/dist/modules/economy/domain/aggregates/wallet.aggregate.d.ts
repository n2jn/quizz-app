import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
export declare enum TransactionType {
    EARNED = "EARNED",
    SPENT = "SPENT"
}
export interface TransactionData {
    type: TransactionType;
    amount: number;
    source: string;
    description: string | null;
    balanceAfter: number;
    createdAt: Date;
}
export interface WalletProps {
    id: string;
    userId: string;
    balance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Wallet extends AggregateRoot<string> {
    private props;
    private constructor();
    get userId(): string;
    get balance(): number;
    get lifetimeEarned(): number;
    get lifetimeSpent(): number;
    get createdAt(): Date;
    get updatedAt(): Date;
    static create(id: string, userId: string): Wallet;
    addCoins(amount: number, source: string, description?: string): void;
    spendCoins(amount: number, source: string, description?: string): void;
    hasBalance(amount: number): boolean;
    static fromPersistence(props: WalletProps): Wallet;
}

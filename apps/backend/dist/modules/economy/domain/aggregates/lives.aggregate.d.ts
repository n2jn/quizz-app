import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
export interface LivesProps {
    id: string;
    userId: string;
    currentLives: number;
    maxLives: number;
    lastRegenAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Lives extends AggregateRoot<string> {
    private props;
    private static readonly REGEN_INTERVAL_MINUTES;
    private constructor();
    get userId(): string;
    get currentLives(): number;
    get maxLives(): number;
    get lastRegenAt(): Date | null;
    get createdAt(): Date;
    get updatedAt(): Date;
    static create(id: string, userId: string, maxLives?: number): Lives;
    consumeLife(): void;
    restoreLife(isPurchased?: boolean): void;
    regenerateLives(): number;
    hasLives(): boolean;
    static fromPersistence(props: LivesProps): Lives;
}

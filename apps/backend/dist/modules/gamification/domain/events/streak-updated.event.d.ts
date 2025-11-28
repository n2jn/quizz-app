import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface StreakUpdatedEventProps {
    userId: string;
    currentStreak: number;
    longestStreak: number;
    occurredAt: Date;
}
export declare class StreakUpdatedEvent extends DomainEvent {
    readonly props: StreakUpdatedEventProps;
    constructor(props: StreakUpdatedEventProps);
    getAggregateId(): string;
    get userId(): string;
    get currentStreak(): number;
}

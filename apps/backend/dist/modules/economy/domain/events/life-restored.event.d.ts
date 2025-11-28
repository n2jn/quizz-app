import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface LifeRestoredEventProps {
    userId: string;
    livesRemaining: number;
    isPurchased: boolean;
    occurredAt: Date;
}
export declare class LifeRestoredEvent extends DomainEvent {
    readonly props: LifeRestoredEventProps;
    constructor(props: LifeRestoredEventProps);
    getAggregateId(): string;
    get userId(): string;
    get livesRemaining(): number;
    get isPurchased(): boolean;
}

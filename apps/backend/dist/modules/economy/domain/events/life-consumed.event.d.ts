import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface LifeConsumedEventProps {
    userId: string;
    livesRemaining: number;
    occurredAt: Date;
}
export declare class LifeConsumedEvent extends DomainEvent {
    readonly props: LifeConsumedEventProps;
    constructor(props: LifeConsumedEventProps);
    getAggregateId(): string;
    get userId(): string;
    get livesRemaining(): number;
}

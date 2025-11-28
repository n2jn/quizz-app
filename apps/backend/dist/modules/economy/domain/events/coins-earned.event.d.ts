import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface CoinsEarnedEventProps {
    userId: string;
    amount: number;
    source: string;
    description: string | null;
    balanceAfter: number;
    occurredAt: Date;
}
export declare class CoinsEarnedEvent extends DomainEvent {
    readonly props: CoinsEarnedEventProps;
    constructor(props: CoinsEarnedEventProps);
    getAggregateId(): string;
    get userId(): string;
    get amount(): number;
    get source(): string;
    get balanceAfter(): number;
}

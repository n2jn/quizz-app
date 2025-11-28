import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface CoinsSpentEventProps {
    userId: string;
    amount: number;
    source: string;
    description: string | null;
    balanceAfter: number;
    occurredAt: Date;
}
export declare class CoinsSpentEvent extends DomainEvent {
    readonly props: CoinsSpentEventProps;
    constructor(props: CoinsSpentEventProps);
    getAggregateId(): string;
    get userId(): string;
    get amount(): number;
    get source(): string;
    get balanceAfter(): number;
}

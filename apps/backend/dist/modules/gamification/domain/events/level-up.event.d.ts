import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface LevelUpEventProps {
    userId: string;
    newLevel: number;
    totalXP: number;
    occurredAt: Date;
}
export declare class LevelUpEvent extends DomainEvent {
    readonly props: LevelUpEventProps;
    constructor(props: LevelUpEventProps);
    getAggregateId(): string;
    get userId(): string;
    get newLevel(): number;
}

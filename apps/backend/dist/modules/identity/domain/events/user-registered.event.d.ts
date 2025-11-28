import { DomainEvent } from '@shared/domain/base';
export interface UserRegisteredEventProps {
    userId: string;
    email: string;
    username: string;
}
export declare class UserRegisteredEvent extends DomainEvent {
    readonly props: UserRegisteredEventProps;
    constructor(props: UserRegisteredEventProps);
    getAggregateId(): string;
}

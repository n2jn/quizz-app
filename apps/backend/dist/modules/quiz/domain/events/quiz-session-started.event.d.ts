import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface QuizSessionStartedEventProps {
    sessionId: string;
    userId: string;
    categoryId: string | null;
    difficultyId: string;
    occurredAt: Date;
}
export declare class QuizSessionStartedEvent extends DomainEvent {
    readonly props: QuizSessionStartedEventProps;
    constructor(props: QuizSessionStartedEventProps);
    getAggregateId(): string;
    get sessionId(): string;
    get userId(): string;
    get categoryId(): string | null;
    get difficultyId(): string;
}

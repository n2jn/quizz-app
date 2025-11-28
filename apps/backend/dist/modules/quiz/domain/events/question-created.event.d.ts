import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface QuestionCreatedEventProps {
    questionId: string;
    categoryId: string;
    difficultyId: string;
    createdById: string;
    occurredAt: Date;
}
export declare class QuestionCreatedEvent extends DomainEvent {
    readonly props: QuestionCreatedEventProps;
    constructor(props: QuestionCreatedEventProps);
    getAggregateId(): string;
    get questionId(): string;
    get categoryId(): string;
    get difficultyId(): string;
    get createdById(): string;
}

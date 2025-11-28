import { DomainEvent } from '@shared/domain/base/domain-event.base';
export interface QuizSessionCompletedEventProps {
    sessionId: string;
    userId: string;
    categoryId: string | null;
    difficultyId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    totalPoints: number;
    occurredAt: Date;
}
export declare class QuizSessionCompletedEvent extends DomainEvent {
    readonly props: QuizSessionCompletedEventProps;
    constructor(props: QuizSessionCompletedEventProps);
    getAggregateId(): string;
    get sessionId(): string;
    get userId(): string;
    get categoryId(): string | null;
    get difficultyId(): string;
    get score(): number;
    get totalQuestions(): number;
    get correctAnswers(): number;
    get totalPoints(): number;
    get isPerfectScore(): boolean;
}

import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
export declare enum SessionStatus {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ABANDONED = "ABANDONED"
}
export interface SessionAnswerData {
    questionId: string;
    answerId: string;
    isCorrect: boolean;
    timeSpent: number;
    pointsEarned: number;
    timeBonus: number;
}
export interface QuizSessionProps {
    id: string;
    userId: string;
    categoryId: string | null;
    difficultyId: string;
    status: SessionStatus;
    score: number;
    answers: SessionAnswerData[];
    startedAt: Date;
    completedAt: Date | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class QuizSession extends AggregateRoot<string> {
    private props;
    private constructor();
    get userId(): string;
    get categoryId(): string | null;
    get difficultyId(): string;
    get status(): SessionStatus;
    get score(): number;
    get answers(): readonly SessionAnswerData[];
    get startedAt(): Date;
    get completedAt(): Date | null;
    get expiresAt(): Date;
    get createdAt(): Date;
    get updatedAt(): Date;
    static create(id: string, userId: string, categoryId: string | null, difficultyId: string, sessionDurationMinutes: number): QuizSession;
    submitAnswer(answer: SessionAnswerData): void;
    complete(): void;
    abandon(): void;
    isExpired(): boolean;
    isInProgress(): boolean;
    static fromPersistence(props: QuizSessionProps): QuizSession;
}

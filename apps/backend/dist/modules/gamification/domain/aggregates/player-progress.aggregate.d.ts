import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
export interface PlayerProgressProps {
    id: string;
    userId: string;
    currentXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    totalQuizzes: number;
    perfectQuizzes: number;
    totalCorrect: number;
    totalAnswers: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PlayerProgress extends AggregateRoot<string> {
    private props;
    private static readonly XP_PER_LEVEL;
    private constructor();
    get userId(): string;
    get currentXP(): number;
    get currentLevel(): number;
    get currentStreak(): number;
    get longestStreak(): number;
    get totalQuizzes(): number;
    get perfectQuizzes(): number;
    get totalCorrect(): number;
    get totalAnswers(): number;
    get createdAt(): Date;
    get updatedAt(): Date;
    static create(id: string, userId: string): PlayerProgress;
    addXP(amount: number): void;
    recordQuizCompletion(correctAnswers: number, totalQuestions: number): void;
    incrementStreak(): void;
    resetStreak(): void;
    get accuracy(): number;
    static fromPersistence(props: PlayerProgressProps): PlayerProgress;
}

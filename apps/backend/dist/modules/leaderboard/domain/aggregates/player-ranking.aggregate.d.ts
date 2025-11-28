import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
export interface PlayerRankingProps {
    id: string;
    userId: string;
    globalScore: number;
    weeklyScore: number;
    globalRank: number | null;
    weeklyRank: number | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PlayerRanking extends AggregateRoot<string> {
    private props;
    private constructor();
    get userId(): string;
    get globalScore(): number;
    get weeklyScore(): number;
    get globalRank(): number | null;
    get weeklyRank(): number | null;
    static create(id: string, userId: string): PlayerRanking;
    addScore(points: number): void;
    resetWeeklyScore(): void;
    updateRank(globalRank: number | null, weeklyRank: number | null): void;
    static fromPersistence(props: PlayerRankingProps): PlayerRanking;
}

import { PlayerRanking } from '../aggregates/player-ranking.aggregate';
export interface IPlayerRankingRepository {
    save(ranking: PlayerRanking): Promise<void>;
    findByUserId(userId: string): Promise<PlayerRanking | null>;
    getOrCreate(userId: string): Promise<PlayerRanking>;
    getTopGlobal(limit: number): Promise<PlayerRanking[]>;
    getTopWeekly(limit: number): Promise<PlayerRanking[]>;
}

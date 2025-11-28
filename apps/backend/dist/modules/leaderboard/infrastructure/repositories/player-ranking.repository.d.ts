import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IPlayerRankingRepository } from '../../domain/repositories/player-ranking.repository.interface';
import { PlayerRanking } from '../../domain/aggregates/player-ranking.aggregate';
export declare class PlayerRankingRepository implements IPlayerRankingRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(ranking: PlayerRanking): Promise<void>;
    findByUserId(userId: string): Promise<PlayerRanking | null>;
    getOrCreate(userId: string): Promise<PlayerRanking>;
    getTopGlobal(limit: number): Promise<PlayerRanking[]>;
    getTopWeekly(limit: number): Promise<PlayerRanking[]>;
}

import { IQueryHandler } from '@nestjs/cqrs';
import { GetLeaderboardQuery } from './get-leaderboard.query';
import { IPlayerRankingRepository } from '../../domain/repositories/player-ranking.repository.interface';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
export interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    rank: number | null;
}
export declare class GetLeaderboardHandler implements IQueryHandler<GetLeaderboardQuery, LeaderboardEntry[]> {
    private readonly rankingRepository;
    private readonly prisma;
    constructor(rankingRepository: IPlayerRankingRepository, prisma: PrismaService);
    execute(query: GetLeaderboardQuery): Promise<LeaderboardEntry[]>;
}

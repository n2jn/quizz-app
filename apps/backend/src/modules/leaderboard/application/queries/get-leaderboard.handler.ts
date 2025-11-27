import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { GetLeaderboardQuery } from './get-leaderboard.query';
import { IPlayerRankingRepository } from '../../domain/repositories/player-ranking.repository.interface';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number | null;
}

@Injectable()
@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler
  implements IQueryHandler<GetLeaderboardQuery, LeaderboardEntry[]>
{
  constructor(
    @Inject('IPlayerRankingRepository')
    private readonly rankingRepository: IPlayerRankingRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(query: GetLeaderboardQuery): Promise<LeaderboardEntry[]> {
    const rankings =
      query.type === 'global'
        ? await this.rankingRepository.getTopGlobal(query.limit)
        : await this.rankingRepository.getTopWeekly(query.limit);

    // Fetch usernames
    const userIds = rankings.map((r) => r.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u.username]));

    return rankings.map((ranking) => ({
      userId: ranking.userId,
      username: userMap.get(ranking.userId) || 'Unknown',
      score: query.type === 'global' ? ranking.globalScore : ranking.weeklyScore,
      rank: query.type === 'global' ? ranking.globalRank : ranking.weeklyRank,
    }));
  }
}

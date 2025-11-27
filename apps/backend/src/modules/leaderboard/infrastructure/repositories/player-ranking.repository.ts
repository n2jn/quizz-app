import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IPlayerRankingRepository } from '../../domain/repositories/player-ranking.repository.interface';
import { PlayerRanking } from '../../domain/aggregates/player-ranking.aggregate';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayerRankingRepository implements IPlayerRankingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(ranking: PlayerRanking): Promise<void> {
    await this.prisma.playerRanking.upsert({
      where: { userId: ranking.userId },
      create: {
        id: ranking.id,
        userId: ranking.userId,
        globalScore: ranking.globalScore,
        weeklyScore: ranking.weeklyScore,
        globalRank: ranking.globalRank,
        weeklyRank: ranking.weeklyRank,
      },
      update: {
        globalScore: ranking.globalScore,
        weeklyScore: ranking.weeklyScore,
        globalRank: ranking.globalRank,
        weeklyRank: ranking.weeklyRank,
        updatedAt: new Date(),
      },
    });
  }

  async findByUserId(userId: string): Promise<PlayerRanking | null> {
    const data = await this.prisma.playerRanking.findUnique({
      where: { userId },
    });

    if (!data) return null;

    return PlayerRanking.fromPersistence({
      id: data.id,
      userId: data.userId,
      globalScore: data.globalScore,
      weeklyScore: data.weeklyScore,
      globalRank: data.globalRank,
      weeklyRank: data.weeklyRank,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async getOrCreate(userId: string): Promise<PlayerRanking> {
    let ranking = await this.findByUserId(userId);

    if (!ranking) {
      ranking = PlayerRanking.create(uuidv4(), userId);
      await this.save(ranking);
    }

    return ranking;
  }

  async getTopGlobal(limit: number): Promise<PlayerRanking[]> {
    const data = await this.prisma.playerRanking.findMany({
      orderBy: { globalScore: 'desc' },
      take: limit,
    });

    return data.map((d) =>
      PlayerRanking.fromPersistence({
        id: d.id,
        userId: d.userId,
        globalScore: d.globalScore,
        weeklyScore: d.weeklyScore,
        globalRank: d.globalRank,
        weeklyRank: d.weeklyRank,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }),
    );
  }

  async getTopWeekly(limit: number): Promise<PlayerRanking[]> {
    const data = await this.prisma.playerRanking.findMany({
      orderBy: { weeklyScore: 'desc' },
      take: limit,
    });

    return data.map((d) =>
      PlayerRanking.fromPersistence({
        id: d.id,
        userId: d.userId,
        globalScore: d.globalScore,
        weeklyScore: d.weeklyScore,
        globalRank: d.globalRank,
        weeklyRank: d.weeklyRank,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }),
    );
  }
}

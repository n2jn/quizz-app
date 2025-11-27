import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IPlayerProgressRepository } from '../../domain/repositories/player-progress.repository.interface';
import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayerProgressRepository implements IPlayerProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(progress: PlayerProgress): Promise<void> {
    await this.prisma.playerProgress.upsert({
      where: { userId: progress.userId },
      create: {
        id: progress.id,
        userId: progress.userId,
        currentXP: progress.currentXP,
        currentLevel: progress.currentLevel,
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        totalQuizzes: progress.totalQuizzes,
        perfectQuizzes: progress.perfectQuizzes,
        totalCorrect: progress.totalCorrect,
        totalAnswers: progress.totalAnswers,
      },
      update: {
        currentXP: progress.currentXP,
        currentLevel: progress.currentLevel,
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        totalQuizzes: progress.totalQuizzes,
        perfectQuizzes: progress.perfectQuizzes,
        totalCorrect: progress.totalCorrect,
        totalAnswers: progress.totalAnswers,
        updatedAt: new Date(),
      },
    });
  }

  async findByUserId(userId: string): Promise<PlayerProgress | null> {
    const data = await this.prisma.playerProgress.findUnique({
      where: { userId },
    });

    if (!data) return null;

    return PlayerProgress.fromPersistence({
      id: data.id,
      userId: data.userId,
      currentXP: data.currentXP,
      currentLevel: data.currentLevel,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      totalQuizzes: data.totalQuizzes,
      perfectQuizzes: data.perfectQuizzes,
      totalCorrect: data.totalCorrect,
      totalAnswers: data.totalAnswers,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async getOrCreate(userId: string): Promise<PlayerProgress> {
    let progress = await this.findByUserId(userId);

    if (!progress) {
      progress = PlayerProgress.create(uuidv4(), userId);
      await this.save(progress);
    }

    return progress;
  }
}

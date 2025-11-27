import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';
import { Lives } from '../../domain/aggregates/lives.aggregate';
import { v4 as uuidv4 } from 'uuid';

/**
 * Lives Repository Implementation
 *
 * Implements persistence for Lives aggregate using Prisma.
 */
@Injectable()
export class LivesRepository implements ILivesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(lives: Lives): Promise<void> {
    await this.prisma.lives.upsert({
      where: { userId: lives.userId },
      create: {
        id: lives.id,
        userId: lives.userId,
        currentLives: lives.currentLives,
        maxLives: lives.maxLives,
        lastRegenAt: lives.lastRegenAt,
      },
      update: {
        currentLives: lives.currentLives,
        maxLives: lives.maxLives,
        lastRegenAt: lives.lastRegenAt,
        updatedAt: new Date(),
      },
    });
  }

  async findByUserId(userId: string): Promise<Lives | null> {
    const livesData = await this.prisma.lives.findUnique({
      where: { userId },
    });

    if (!livesData) {
      return null;
    }

    return Lives.fromPersistence({
      id: livesData.id,
      userId: livesData.userId,
      currentLives: livesData.currentLives,
      maxLives: livesData.maxLives,
      lastRegenAt: livesData.lastRegenAt,
      createdAt: livesData.createdAt,
      updatedAt: livesData.updatedAt,
    });
  }

  async getOrCreate(userId: string): Promise<Lives> {
    let lives = await this.findByUserId(userId);

    if (!lives) {
      lives = Lives.create(uuidv4(), userId);
      await this.save(lives);
    }

    return lives;
  }
}

import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { GetLivesQuery } from './get-lives.query';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';

export interface GetLivesResult {
  currentLives: number;
  maxLives: number;
  lastRegenAt: Date | null;
}

/**
 * Get Lives Query Handler
 *
 * Returns user's lives status with regeneration.
 */
@Injectable()
@QueryHandler(GetLivesQuery)
export class GetLivesHandler implements IQueryHandler<GetLivesQuery, GetLivesResult> {
  constructor(
    @Inject('ILivesRepository')
    private readonly livesRepository: ILivesRepository,
  ) {}

  async execute(query: GetLivesQuery): Promise<GetLivesResult> {
    const lives = await this.livesRepository.getOrCreate(query.userId);

    // Trigger regeneration check
    const restored = lives.regenerateLives();
    if (restored > 0) {
      await this.livesRepository.save(lives);
    }

    return {
      currentLives: lives.currentLives,
      maxLives: lives.maxLives,
      lastRegenAt: lives.lastRegenAt,
    };
  }
}

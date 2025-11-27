import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { GetProgressQuery } from './get-progress.query';
import { IPlayerProgressRepository } from '../../domain/repositories/player-progress.repository.interface';

export interface GetProgressResult {
  currentXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalQuizzes: number;
  perfectQuizzes: number;
  accuracy: number;
}

@Injectable()
@QueryHandler(GetProgressQuery)
export class GetProgressHandler implements IQueryHandler<GetProgressQuery, GetProgressResult> {
  constructor(
    @Inject('IPlayerProgressRepository')
    private readonly progressRepository: IPlayerProgressRepository,
  ) {}

  async execute(query: GetProgressQuery): Promise<GetProgressResult> {
    const progress = await this.progressRepository.getOrCreate(query.userId);

    return {
      currentXP: progress.currentXP,
      currentLevel: progress.currentLevel,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      totalQuizzes: progress.totalQuizzes,
      perfectQuizzes: progress.perfectQuizzes,
      accuracy: progress.accuracy,
    };
  }
}

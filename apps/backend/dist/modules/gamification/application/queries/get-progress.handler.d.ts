import { IQueryHandler } from '@nestjs/cqrs';
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
export declare class GetProgressHandler implements IQueryHandler<GetProgressQuery, GetProgressResult> {
    private readonly progressRepository;
    constructor(progressRepository: IPlayerProgressRepository);
    execute(query: GetProgressQuery): Promise<GetProgressResult>;
}

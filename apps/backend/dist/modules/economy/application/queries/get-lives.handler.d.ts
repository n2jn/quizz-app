import { IQueryHandler } from '@nestjs/cqrs';
import { GetLivesQuery } from './get-lives.query';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';
export interface GetLivesResult {
    currentLives: number;
    maxLives: number;
    lastRegenAt: Date | null;
}
export declare class GetLivesHandler implements IQueryHandler<GetLivesQuery, GetLivesResult> {
    private readonly livesRepository;
    constructor(livesRepository: ILivesRepository);
    execute(query: GetLivesQuery): Promise<GetLivesResult>;
}

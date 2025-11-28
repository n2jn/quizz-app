import { IPlayerRankingRepository } from '../../domain/repositories/player-ranking.repository.interface';
export declare class UserRegisteredLeaderboardHandler {
    private readonly rankingRepository;
    private readonly logger;
    constructor(rankingRepository: IPlayerRankingRepository);
    handle(event: any): Promise<void>;
}

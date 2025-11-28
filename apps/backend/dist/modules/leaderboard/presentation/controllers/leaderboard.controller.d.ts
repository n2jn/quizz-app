import { QueryBus } from '@nestjs/cqrs';
export declare class LeaderboardController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    getLeaderboard(type?: 'global' | 'weekly', limit?: number): Promise<any>;
}

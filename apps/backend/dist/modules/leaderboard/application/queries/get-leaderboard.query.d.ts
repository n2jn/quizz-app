export declare class GetLeaderboardQuery {
    readonly type: 'global' | 'weekly';
    readonly limit: number;
    constructor(type: 'global' | 'weekly', limit?: number);
}

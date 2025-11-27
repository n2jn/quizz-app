export class GetLeaderboardQuery {
  constructor(
    public readonly type: 'global' | 'weekly',
    public readonly limit: number = 100,
  ) {}
}

import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';

export interface PlayerRankingProps {
  id: string;
  userId: string;
  globalScore: number;
  weeklyScore: number;
  globalRank: number | null;
  weeklyRank: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PlayerRanking extends AggregateRoot<string> {
  private constructor(private props: PlayerRankingProps) {
    super(props.id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get globalScore(): number {
    return this.props.globalScore;
  }

  get weeklyScore(): number {
    return this.props.weeklyScore;
  }

  get globalRank(): number | null {
    return this.props.globalRank;
  }

  get weeklyRank(): number | null {
    return this.props.weeklyRank;
  }

  static create(id: string, userId: string): PlayerRanking {
    return new PlayerRanking({
      id,
      userId,
      globalScore: 0,
      weeklyScore: 0,
      globalRank: null,
      weeklyRank: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  addScore(points: number): void {
    this.props.globalScore += points;
    this.props.weeklyScore += points;
    this.props.updatedAt = new Date();
  }

  resetWeeklyScore(): void {
    this.props.weeklyScore = 0;
    this.props.updatedAt = new Date();
  }

  updateRank(globalRank: number | null, weeklyRank: number | null): void {
    this.props.globalRank = globalRank;
    this.props.weeklyRank = weeklyRank;
    this.props.updatedAt = new Date();
  }

  static fromPersistence(props: PlayerRankingProps): PlayerRanking {
    return new PlayerRanking(props);
  }
}

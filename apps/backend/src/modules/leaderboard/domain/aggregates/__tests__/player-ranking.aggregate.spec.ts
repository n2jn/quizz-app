import { PlayerRanking } from '../player-ranking.aggregate';

describe('PlayerRanking Aggregate', () => {
  const rankingId = 'ranking-123';
  const userId = 'user-123';

  describe('create', () => {
    it('should create ranking with initial values', () => {
      const ranking = PlayerRanking.create(rankingId, userId);

      expect(ranking.id).toBe(rankingId);
      expect(ranking.userId).toBe(userId);
      expect(ranking.globalScore).toBe(0);
      expect(ranking.weeklyScore).toBe(0);
      expect(ranking.globalRank).toBeNull();
      expect(ranking.weeklyRank).toBeNull();
    });
  });

  describe('addScore', () => {
    it('should add score to both global and weekly', () => {
      const ranking = PlayerRanking.create(rankingId, userId);

      ranking.addScore(100);

      expect(ranking.globalScore).toBe(100);
      expect(ranking.weeklyScore).toBe(100);
    });

    it('should accumulate scores', () => {
      const ranking = PlayerRanking.create(rankingId, userId);

      ranking.addScore(100);
      ranking.addScore(50);
      ranking.addScore(75);

      expect(ranking.globalScore).toBe(225);
      expect(ranking.weeklyScore).toBe(225);
    });
  });

  describe('resetWeeklyScore', () => {
    it('should reset weekly score to zero', () => {
      const ranking = PlayerRanking.create(rankingId, userId);

      ranking.addScore(250);
      ranking.resetWeeklyScore();

      expect(ranking.weeklyScore).toBe(0);
      expect(ranking.globalScore).toBe(250);
    });
  });

  describe('updateRank', () => {
    it('should update both ranks', () => {
      const ranking = PlayerRanking.create(rankingId, userId);

      ranking.updateRank(5, 3);

      expect(ranking.globalRank).toBe(5);
      expect(ranking.weeklyRank).toBe(3);
    });

    it('should accept null ranks', () => {
      const ranking = PlayerRanking.create(rankingId, userId);

      ranking.updateRank(null, null);

      expect(ranking.globalRank).toBeNull();
      expect(ranking.weeklyRank).toBeNull();
    });

    it('should update ranks independently', () => {
      const ranking = PlayerRanking.create(rankingId, userId);

      ranking.updateRank(10, null);

      expect(ranking.globalRank).toBe(10);
      expect(ranking.weeklyRank).toBeNull();
    });
  });
});

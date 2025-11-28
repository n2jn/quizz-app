import { PlayerProgress } from '../player-progress.aggregate';

describe('PlayerProgress Aggregate', () => {
  const progressId = 'progress-123';
  const userId = 'user-123';

  describe('create', () => {
    it('should create progress with initial values', () => {
      const progress = PlayerProgress.create(progressId, userId);

      expect(progress.id).toBe(progressId);
      expect(progress.userId).toBe(userId);
      expect(progress.currentXP).toBe(0);
      expect(progress.currentLevel).toBe(1);
      expect(progress.currentStreak).toBe(0);
      expect(progress.longestStreak).toBe(0);
      expect(progress.totalQuizzes).toBe(0);
      expect(progress.perfectQuizzes).toBe(0);
      expect(progress.totalCorrect).toBe(0);
      expect(progress.totalAnswers).toBe(0);
    });
  });

  describe('addXP', () => {
    it('should add XP', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.addXP(250);

      expect(progress.currentXP).toBe(250);
    });

    it('should level up at 1000 XP', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.addXP(1000);

      expect(progress.currentLevel).toBe(2);
    });

    it('should emit LevelUpEvent', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.addXP(1000);

      expect(progress.domainEvents).toHaveLength(1);
      expect(progress.domainEvents[0].eventName).toBe('player.level_up');
    });

    it('should level up multiple times', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.addXP(2500);

      expect(progress.currentLevel).toBe(3);
      expect(progress.currentXP).toBe(2500);
    });

    it('should not level up below threshold', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.addXP(999);

      expect(progress.currentLevel).toBe(1);
    });

    it('should handle zero XP', () => {
      const progress = PlayerProgress.create(progressId, userId);
      const initialXP = progress.currentXP;

      progress.addXP(0);

      expect(progress.currentXP).toBe(initialXP);
    });

    it('should handle negative XP gracefully', () => {
      const progress = PlayerProgress.create(progressId, userId);
      const initialXP = progress.currentXP;

      progress.addXP(-100);

      expect(progress.currentXP).toBe(initialXP);
    });
  });

  describe('recordQuizCompletion', () => {
    it('should record quiz stats', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.recordQuizCompletion(7, 10);

      expect(progress.totalQuizzes).toBe(1);
      expect(progress.totalCorrect).toBe(7);
      expect(progress.totalAnswers).toBe(10);
      expect(progress.perfectQuizzes).toBe(0);
    });

    it('should increment perfect quizzes for 100% score', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.recordQuizCompletion(10, 10);

      expect(progress.perfectQuizzes).toBe(1);
    });

    it('should accumulate multiple quizzes', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.recordQuizCompletion(7, 10);
      progress.recordQuizCompletion(8, 10);
      progress.recordQuizCompletion(10, 10);

      expect(progress.totalQuizzes).toBe(3);
      expect(progress.totalCorrect).toBe(25);
      expect(progress.totalAnswers).toBe(30);
      expect(progress.perfectQuizzes).toBe(1);
    });
  });

  describe('incrementStreak', () => {
    it('should increment streak', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.incrementStreak();

      expect(progress.currentStreak).toBe(1);
    });

    it('should emit StreakUpdatedEvent', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.incrementStreak();

      expect(progress.domainEvents).toHaveLength(1);
      expect(progress.domainEvents[0].eventName).toBe('player.streak_updated');
    });

    it('should update longest streak', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.incrementStreak();
      progress.incrementStreak();
      progress.incrementStreak();

      expect(progress.currentStreak).toBe(3);
      expect(progress.longestStreak).toBe(3);
    });

    it('should maintain longest streak after reset', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.incrementStreak();
      progress.incrementStreak();
      progress.incrementStreak();
      progress.resetStreak();
      progress.incrementStreak();

      expect(progress.currentStreak).toBe(1);
      expect(progress.longestStreak).toBe(3);
    });
  });

  describe('resetStreak', () => {
    it('should reset current streak to zero', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.incrementStreak();
      progress.incrementStreak();
      progress.resetStreak();

      expect(progress.currentStreak).toBe(0);
    });

    it('should preserve longest streak', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.incrementStreak();
      progress.incrementStreak();
      progress.incrementStreak();
      const longest = progress.longestStreak;

      progress.resetStreak();

      expect(progress.longestStreak).toBe(longest);
    });
  });

  describe('accuracy', () => {
    it('should calculate accuracy correctly', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.recordQuizCompletion(8, 10);

      expect(progress.accuracy).toBe(80);
    });

    it('should return 0 for no answers', () => {
      const progress = PlayerProgress.create(progressId, userId);

      expect(progress.accuracy).toBe(0);
    });

    it('should calculate accuracy across multiple quizzes', () => {
      const progress = PlayerProgress.create(progressId, userId);

      progress.recordQuizCompletion(8, 10);
      progress.recordQuizCompletion(9, 10);

      expect(progress.accuracy).toBe(85);
    });
  });
});

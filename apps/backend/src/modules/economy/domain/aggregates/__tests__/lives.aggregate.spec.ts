import { Lives } from '../lives.aggregate';

describe('Lives Aggregate', () => {
  const livesId = 'lives-123';
  const userId = 'user-123';

  describe('create', () => {
    it('should create lives with max lives', () => {
      const lives = Lives.create(livesId, userId);

      expect(lives.id).toBe(livesId);
      expect(lives.userId).toBe(userId);
      expect(lives.currentLives).toBe(5);
      expect(lives.maxLives).toBe(5);
      expect(lives.lastRegenAt).toBeNull();
    });

    it('should accept custom max lives', () => {
      const lives = Lives.create(livesId, userId, 10);

      expect(lives.currentLives).toBe(10);
      expect(lives.maxLives).toBe(10);
    });
  });

  describe('consumeLife', () => {
    it('should consume one life', () => {
      const lives = Lives.create(livesId, userId);

      lives.consumeLife();

      expect(lives.currentLives).toBe(4);
    });

    it('should emit LifeConsumedEvent', () => {
      const lives = Lives.create(livesId, userId);

      lives.consumeLife();

      expect(lives.domainEvents).toHaveLength(1);
      expect(lives.domainEvents[0].eventName).toBe('life.consumed');
    });

    it('should start regeneration timer', () => {
      const lives = Lives.create(livesId, userId);

      lives.consumeLife();

      expect(lives.lastRegenAt).not.toBeNull();
    });

    it('should throw error when no lives available', () => {
      const lives = Lives.create(livesId, userId);

      for (let i = 0; i < 5; i++) {
        lives.consumeLife();
      }

      expect(() => lives.consumeLife()).toThrow('No lives available');
    });

    it('should consume multiple lives', () => {
      const lives = Lives.create(livesId, userId);

      lives.consumeLife();
      lives.consumeLife();
      lives.consumeLife();

      expect(lives.currentLives).toBe(2);
    });
  });

  describe('restoreLife', () => {
    it('should restore one life', () => {
      const lives = Lives.create(livesId, userId);
      lives.consumeLife();

      lives.restoreLife(false);

      expect(lives.currentLives).toBe(5);
    });

    it('should emit LifeRestoredEvent', () => {
      const lives = Lives.create(livesId, userId);
      lives.consumeLife();

      lives.restoreLife(false);

      const events = lives.domainEvents;
      expect(events).toHaveLength(2);
      expect(events[1].eventName).toBe('life.restored');
    });

    it('should stop regeneration timer at max', () => {
      const lives = Lives.create(livesId, userId);
      lives.consumeLife();

      lives.restoreLife(false);

      expect(lives.lastRegenAt).toBeNull();
    });

    it('should throw error when already at max (non-purchased)', () => {
      const lives = Lives.create(livesId, userId);

      expect(() => lives.restoreLife(false)).toThrow('Lives already at maximum');
    });

    it('should allow exceeding max when purchased', () => {
      const lives = Lives.create(livesId, userId);

      lives.restoreLife(true);

      expect(lives.currentLives).toBe(6);
    });

    it('should continue regeneration timer when not at max', () => {
      const lives = Lives.create(livesId, userId);
      lives.consumeLife();
      lives.consumeLife();

      lives.restoreLife(false);

      expect(lives.currentLives).toBe(4);
      expect(lives.lastRegenAt).not.toBeNull();
    });
  });

  describe('regenerateLives', () => {
    it('should return 0 when at max lives', () => {
      const lives = Lives.create(livesId, userId);

      const restored = lives.regenerateLives();

      expect(restored).toBe(0);
    });

    it('should return 0 when no regeneration in progress', () => {
      const lives = Lives.create(livesId, userId);
      lives.consumeLife();
      // Manually clear regen timer
      (lives as any).props.lastRegenAt = null;

      const restored = lives.regenerateLives();

      expect(restored).toBe(0);
    });
  });

  describe('hasLives', () => {
    it('should return true when lives available', () => {
      const lives = Lives.create(livesId, userId);

      expect(lives.hasLives()).toBe(true);
    });

    it('should return false when no lives', () => {
      const lives = Lives.create(livesId, userId);

      for (let i = 0; i < 5; i++) {
        lives.consumeLife();
      }

      expect(lives.hasLives()).toBe(false);
    });
  });
});

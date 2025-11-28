import { Wallet } from '../wallet.aggregate';

describe('Wallet Aggregate', () => {
  const walletId = 'wallet-123';
  const userId = 'user-123';

  describe('create', () => {
    it('should create wallet with zero balance', () => {
      const wallet = Wallet.create(walletId, userId);

      expect(wallet.id).toBe(walletId);
      expect(wallet.userId).toBe(userId);
      expect(wallet.balance).toBe(0);
      expect(wallet.lifetimeEarned).toBe(0);
      expect(wallet.lifetimeSpent).toBe(0);
    });
  });

  describe('addCoins', () => {
    it('should add coins and update balance', () => {
      const wallet = Wallet.create(walletId, userId);

      wallet.addCoins(100, 'quiz_reward');

      expect(wallet.balance).toBe(100);
      expect(wallet.lifetimeEarned).toBe(100);
    });

    it('should emit CoinsEarnedEvent', () => {
      const wallet = Wallet.create(walletId, userId);

      wallet.addCoins(100, 'quiz_reward', 'Completed quiz');

      expect(wallet.domainEvents).toHaveLength(1);
      expect(wallet.domainEvents[0].eventName).toBe('coins.earned');
    });

    it('should accumulate lifetime earned', () => {
      const wallet = Wallet.create(walletId, userId);

      wallet.addCoins(100, 'quiz_reward');
      wallet.addCoins(50, 'badge_reward');

      expect(wallet.balance).toBe(150);
      expect(wallet.lifetimeEarned).toBe(150);
    });

    it('should throw error for negative amount', () => {
      const wallet = Wallet.create(walletId, userId);

      expect(() => wallet.addCoins(-10, 'test')).toThrow('Amount must be positive');
    });

    it('should throw error for zero amount', () => {
      const wallet = Wallet.create(walletId, userId);

      expect(() => wallet.addCoins(0, 'test')).toThrow('Amount must be positive');
    });
  });

  describe('spendCoins', () => {
    it('should spend coins and update balance', () => {
      const wallet = Wallet.create(walletId, userId);
      wallet.addCoins(100, 'quiz_reward');

      wallet.spendCoins(30, 'shop_purchase');

      expect(wallet.balance).toBe(70);
      expect(wallet.lifetimeSpent).toBe(30);
    });

    it('should emit CoinsSpentEvent', () => {
      const wallet = Wallet.create(walletId, userId);
      wallet.addCoins(100, 'quiz_reward');

      wallet.spendCoins(30, 'shop_purchase', 'Bought item');

      const events = wallet.domainEvents;
      expect(events).toHaveLength(2);
      expect(events[1].eventName).toBe('coins.spent');
    });

    it('should accumulate lifetime spent', () => {
      const wallet = Wallet.create(walletId, userId);
      wallet.addCoins(200, 'quiz_reward');

      wallet.spendCoins(50, 'shop_purchase');
      wallet.spendCoins(30, 'shop_purchase');

      expect(wallet.balance).toBe(120);
      expect(wallet.lifetimeSpent).toBe(80);
    });

    it('should throw error for insufficient balance', () => {
      const wallet = Wallet.create(walletId, userId);
      wallet.addCoins(50, 'quiz_reward');

      expect(() => wallet.spendCoins(100, 'shop_purchase')).toThrow('Insufficient balance');
    });

    it('should throw error for negative amount', () => {
      const wallet = Wallet.create(walletId, userId);

      expect(() => wallet.spendCoins(-10, 'test')).toThrow('Amount must be positive');
    });

    it('should throw error for zero amount', () => {
      const wallet = Wallet.create(walletId, userId);

      expect(() => wallet.spendCoins(0, 'test')).toThrow('Amount must be positive');
    });
  });

  describe('hasBalance', () => {
    it('should return true when sufficient balance', () => {
      const wallet = Wallet.create(walletId, userId);
      wallet.addCoins(100, 'quiz_reward');

      expect(wallet.hasBalance(50)).toBe(true);
    });

    it('should return false when insufficient balance', () => {
      const wallet = Wallet.create(walletId, userId);
      wallet.addCoins(30, 'quiz_reward');

      expect(wallet.hasBalance(50)).toBe(false);
    });

    it('should return true for exact balance', () => {
      const wallet = Wallet.create(walletId, userId);
      wallet.addCoins(100, 'quiz_reward');

      expect(wallet.hasBalance(100)).toBe(true);
    });
  });
});

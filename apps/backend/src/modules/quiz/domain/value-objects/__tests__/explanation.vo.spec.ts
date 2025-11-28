import { Explanation } from '../explanation.vo';

describe('Explanation', () => {
  describe('create', () => {
    it('should create valid explanation', () => {
      const explanation = Explanation.create('Paris is the capital and most populous city of France.');

      expect(explanation.value).toBe('Paris is the capital and most populous city of France.');
    });

    it('should throw error for empty explanation', () => {
      expect(() => Explanation.create('')).toThrow('Explanation cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => Explanation.create('   ')).toThrow('Explanation cannot be empty');
    });

    it('should throw error for explanation too short', () => {
      expect(() => Explanation.create('Too short')).toThrow(
        'Explanation must be at least 20 characters',
      );
    });

    it('should throw error for explanation too long', () => {
      const longText = 'a'.repeat(2001);
      expect(() => Explanation.create(longText)).toThrow(
        'Explanation must not exceed 2000 characters',
      );
    });

    it('should accept explanation at minimum length', () => {
      const minText = 'a'.repeat(20);
      const explanation = Explanation.create(minText);
      expect(explanation.value).toBe(minText);
    });

    it('should accept explanation at maximum length', () => {
      const maxText = 'a'.repeat(2000);
      const explanation = Explanation.create(maxText);
      expect(explanation.value).toBe(maxText);
    });

    it('should trim whitespace', () => {
      const explanation = Explanation.create('  This is a valid explanation text.  ');
      expect(explanation.value).toBe('This is a valid explanation text.');
    });
  });

  describe('equality', () => {
    it('should be equal for same explanation', () => {
      const exp1 = Explanation.create('Paris is the capital and most populous city of France.');
      const exp2 = Explanation.create('Paris is the capital and most populous city of France.');

      expect(exp1.equals(exp2)).toBe(true);
    });

    it('should not be equal for different explanation', () => {
      const exp1 = Explanation.create('Paris is the capital and most populous city of France.');
      const exp2 = Explanation.create('Madrid is the capital and most populous city of Spain.');

      expect(exp1.equals(exp2)).toBe(false);
    });
  });
});

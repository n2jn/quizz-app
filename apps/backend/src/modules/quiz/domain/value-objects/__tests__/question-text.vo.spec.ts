import { QuestionText } from '../question-text.vo';

describe('QuestionText', () => {
  describe('create', () => {
    it('should create valid question text', () => {
      const text = QuestionText.create('What is the capital of France?');

      expect(text.value).toBe('What is the capital of France?');
    });

    it('should throw error for empty text', () => {
      expect(() => QuestionText.create('')).toThrow('Question text cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => QuestionText.create('   ')).toThrow('Question text cannot be empty');
    });

    it('should throw error for text too short', () => {
      expect(() => QuestionText.create('Short')).toThrow(
        'Question text must be at least 10 characters',
      );
    });

    it('should throw error for text too long', () => {
      const longText = 'a'.repeat(1001);
      expect(() => QuestionText.create(longText)).toThrow(
        'Question text must not exceed 1000 characters',
      );
    });

    it('should accept text at minimum length', () => {
      const text = QuestionText.create('1234567890');
      expect(text.value).toBe('1234567890');
    });

    it('should accept text at maximum length', () => {
      const maxText = 'a'.repeat(1000);
      const text = QuestionText.create(maxText);
      expect(text.value).toBe(maxText);
    });

    it('should trim whitespace', () => {
      const text = QuestionText.create('  What is this?  ');
      expect(text.value).toBe('What is this?');
    });
  });

  describe('equality', () => {
    it('should be equal for same text', () => {
      const text1 = QuestionText.create('What is the capital of France?');
      const text2 = QuestionText.create('What is the capital of France?');

      expect(text1.equals(text2)).toBe(true);
    });

    it('should not be equal for different text', () => {
      const text1 = QuestionText.create('What is the capital of France?');
      const text2 = QuestionText.create('What is the capital of Spain?');

      expect(text1.equals(text2)).toBe(false);
    });
  });
});

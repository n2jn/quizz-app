"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const question_text_vo_1 = require("../question-text.vo");
describe('QuestionText', () => {
    describe('create', () => {
        it('should create valid question text', () => {
            const text = question_text_vo_1.QuestionText.create('What is the capital of France?');
            expect(text.value).toBe('What is the capital of France?');
        });
        it('should throw error for empty text', () => {
            expect(() => question_text_vo_1.QuestionText.create('')).toThrow('Question text cannot be empty');
        });
        it('should throw error for whitespace only', () => {
            expect(() => question_text_vo_1.QuestionText.create('   ')).toThrow('Question text cannot be empty');
        });
        it('should throw error for text too short', () => {
            expect(() => question_text_vo_1.QuestionText.create('Short')).toThrow('Question text must be at least 10 characters');
        });
        it('should throw error for text too long', () => {
            const longText = 'a'.repeat(1001);
            expect(() => question_text_vo_1.QuestionText.create(longText)).toThrow('Question text must not exceed 1000 characters');
        });
        it('should accept text at minimum length', () => {
            const text = question_text_vo_1.QuestionText.create('1234567890');
            expect(text.value).toBe('1234567890');
        });
        it('should accept text at maximum length', () => {
            const maxText = 'a'.repeat(1000);
            const text = question_text_vo_1.QuestionText.create(maxText);
            expect(text.value).toBe(maxText);
        });
        it('should trim whitespace', () => {
            const text = question_text_vo_1.QuestionText.create('  What is this?  ');
            expect(text.value).toBe('What is this?');
        });
    });
    describe('equality', () => {
        it('should be equal for same text', () => {
            const text1 = question_text_vo_1.QuestionText.create('What is the capital of France?');
            const text2 = question_text_vo_1.QuestionText.create('What is the capital of France?');
            expect(text1.equals(text2)).toBe(true);
        });
        it('should not be equal for different text', () => {
            const text1 = question_text_vo_1.QuestionText.create('What is the capital of France?');
            const text2 = question_text_vo_1.QuestionText.create('What is the capital of Spain?');
            expect(text1.equals(text2)).toBe(false);
        });
    });
});
//# sourceMappingURL=question-text.vo.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const question_aggregate_1 = require("../question.aggregate");
const question_text_vo_1 = require("../../value-objects/question-text.vo");
const explanation_vo_1 = require("../../value-objects/explanation.vo");
const answer_entity_1 = require("../../entities/answer.entity");
describe('Question Aggregate', () => {
    const validText = question_text_vo_1.QuestionText.create('What is the capital of France?');
    const validExplanation = explanation_vo_1.Explanation.create('Paris is the capital and most populous city of France.');
    const categoryId = 'cat-123';
    const difficultyId = 'diff-123';
    const userId = 'user-123';
    const createValidAnswers = () => [
        answer_entity_1.Answer.create('ans-1', 'Paris', true),
        answer_entity_1.Answer.create('ans-2', 'London', false),
        answer_entity_1.Answer.create('ans-3', 'Berlin', false),
        answer_entity_1.Answer.create('ans-4', 'Madrid', false),
    ];
    describe('create', () => {
        it('should create question with valid data', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            expect(question.id).toBe('q-123');
            expect(question.text).toBe(validText);
            expect(question.explanation).toBe(validExplanation);
            expect(question.categoryId).toBe(categoryId);
            expect(question.difficultyId).toBe(difficultyId);
            expect(question.createdById).toBe(userId);
            expect(question.answers).toHaveLength(4);
            expect(question.status).toBe(question_aggregate_1.QuestionStatus.DRAFT);
        });
        it('should emit QuestionCreatedEvent', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            expect(question.domainEvents).toHaveLength(1);
            expect(question.domainEvents[0].eventName).toBe('question.created');
        });
        it('should throw error for too few answers', () => {
            const answers = [answer_entity_1.Answer.create('ans-1', 'Paris', true)];
            expect(() => question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers)).toThrow('Question must have between 2 and 6 answers');
        });
        it('should throw error for too many answers', () => {
            const answers = [
                answer_entity_1.Answer.create('ans-1', 'A', true),
                answer_entity_1.Answer.create('ans-2', 'B', false),
                answer_entity_1.Answer.create('ans-3', 'C', false),
                answer_entity_1.Answer.create('ans-4', 'D', false),
                answer_entity_1.Answer.create('ans-5', 'E', false),
                answer_entity_1.Answer.create('ans-6', 'F', false),
                answer_entity_1.Answer.create('ans-7', 'G', false),
            ];
            expect(() => question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers)).toThrow('Question must have between 2 and 6 answers');
        });
        it('should throw error for no correct answer', () => {
            const answers = [
                answer_entity_1.Answer.create('ans-1', 'Paris', false),
                answer_entity_1.Answer.create('ans-2', 'London', false),
            ];
            expect(() => question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers)).toThrow('Question must have exactly one correct answer');
        });
        it('should throw error for multiple correct answers', () => {
            const answers = [
                answer_entity_1.Answer.create('ans-1', 'Paris', true),
                answer_entity_1.Answer.create('ans-2', 'London', true),
            ];
            expect(() => question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers)).toThrow('Question must have exactly one correct answer');
        });
        it('should accept optional image URL', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers, 'https://example.com/image.jpg');
            expect(question.imageUrl).toBe('https://example.com/image.jpg');
        });
    });
    describe('publish', () => {
        it('should change status to PUBLISHED', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            question.publish();
            expect(question.status).toBe(question_aggregate_1.QuestionStatus.PUBLISHED);
        });
        it('should throw error if already published', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            question.publish();
            expect(() => question.publish()).toThrow('Question is already published');
        });
        it('should throw error if archived', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            question.archive();
            expect(() => question.publish()).toThrow('Cannot publish archived question');
        });
    });
    describe('archive', () => {
        it('should change status to ARCHIVED', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            question.archive();
            expect(question.status).toBe(question_aggregate_1.QuestionStatus.ARCHIVED);
        });
        it('should throw error if already archived', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            question.archive();
            expect(() => question.archive()).toThrow('Question is already archived');
        });
    });
    describe('isPublished', () => {
        it('should return true for published question', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            question.publish();
            expect(question.isPublished()).toBe(true);
        });
        it('should return false for draft question', () => {
            const answers = createValidAnswers();
            const question = question_aggregate_1.Question.create('q-123', validText, validExplanation, categoryId, difficultyId, userId, answers);
            expect(question.isPublished()).toBe(false);
        });
    });
});
//# sourceMappingURL=question.aggregate.spec.js.map
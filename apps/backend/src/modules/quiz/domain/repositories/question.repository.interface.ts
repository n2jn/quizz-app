import { Question, QuestionStatus } from '../aggregates/question.aggregate';

/**
 * Question Repository Interface
 *
 * Defines contract for question persistence operations.
 */
export interface IQuestionRepository {
  save(question: Question): Promise<void>;
  findById(id: string): Promise<Question | null>;
  findByCategory(categoryId: string, status?: QuestionStatus): Promise<Question[]>;
  findByDifficulty(difficultyId: string, status?: QuestionStatus): Promise<Question[]>;
  findRandomQuestions(
    difficultyId: string,
    categoryId: string | null,
    count: number,
  ): Promise<Question[]>;
  delete(id: string): Promise<void>;
}

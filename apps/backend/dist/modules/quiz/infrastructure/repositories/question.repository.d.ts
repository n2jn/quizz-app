import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
import { Question, QuestionStatus } from '../../domain/aggregates/question.aggregate';
export declare class QuestionRepository implements IQuestionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(question: Question): Promise<void>;
    findById(id: string): Promise<Question | null>;
    findByCategory(categoryId: string, status?: QuestionStatus): Promise<Question[]>;
    findByDifficulty(difficultyId: string, status?: QuestionStatus): Promise<Question[]>;
    findRandomQuestions(difficultyId: string, categoryId: string | null, count: number): Promise<Question[]>;
    delete(id: string): Promise<void>;
    private toDomain;
}

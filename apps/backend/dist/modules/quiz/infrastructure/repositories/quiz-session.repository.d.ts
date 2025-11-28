import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IQuizSessionRepository } from '../../domain/repositories/quiz-session.repository.interface';
import { QuizSession, SessionStatus } from '../../domain/aggregates/quiz-session.aggregate';
export declare class QuizSessionRepository implements IQuizSessionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(session: QuizSession): Promise<void>;
    findById(id: string): Promise<QuizSession | null>;
    findByUserId(userId: string, status?: SessionStatus): Promise<QuizSession[]>;
    findActiveByUserId(userId: string): Promise<QuizSession | null>;
    delete(id: string): Promise<void>;
    private toDomain;
}

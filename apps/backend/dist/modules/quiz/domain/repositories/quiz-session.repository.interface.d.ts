import { QuizSession, SessionStatus } from '../aggregates/quiz-session.aggregate';
export interface IQuizSessionRepository {
    save(session: QuizSession): Promise<void>;
    findById(id: string): Promise<QuizSession | null>;
    findByUserId(userId: string, status?: SessionStatus): Promise<QuizSession[]>;
    findActiveByUserId(userId: string): Promise<QuizSession | null>;
    delete(id: string): Promise<void>;
}

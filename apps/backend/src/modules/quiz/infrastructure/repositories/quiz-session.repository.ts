import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IQuizSessionRepository } from '../../domain/repositories/quiz-session.repository.interface';
import { QuizSession, SessionStatus, SessionAnswerData } from '../../domain/aggregates/quiz-session.aggregate';

/**
 * Quiz Session Repository Implementation
 *
 * Implements persistence for QuizSession aggregate using Prisma.
 */
@Injectable()
export class QuizSessionRepository implements IQuizSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(session: QuizSession): Promise<void> {
    // Check if session exists
    const existing = await this.prisma.quizSession.findUnique({
      where: { id: session.id },
    });

    if (existing) {
      // Update session and upsert answers
      await this.prisma.quizSession.update({
        where: { id: session.id },
        data: {
          status: session.status,
          score: session.score,
          completedAt: session.completedAt,
          updatedAt: new Date(),
        },
      });

      // Upsert session answers
      for (const answer of session.answers) {
        await this.prisma.sessionAnswer.upsert({
          where: {
            sessionId_questionId: {
              sessionId: session.id,
              questionId: answer.questionId,
            },
          },
          create: {
            id: `${session.id}-${answer.questionId}`,
            sessionId: session.id,
            questionId: answer.questionId,
            answerId: answer.answerId,
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent,
            pointsEarned: answer.pointsEarned,
            timeBonus: answer.timeBonus,
          },
          update: {
            isCorrect: answer.isCorrect,
            timeSpent: answer.timeSpent,
            pointsEarned: answer.pointsEarned,
            timeBonus: answer.timeBonus,
          },
        });
      }
    } else {
      // Create new session
      await this.prisma.quizSession.create({
        data: {
          id: session.id,
          userId: session.userId,
          categoryId: session.categoryId,
          difficultyId: session.difficultyId,
          status: session.status,
          score: session.score,
          startedAt: session.startedAt,
          completedAt: session.completedAt,
          expiresAt: session.expiresAt,
        },
      });
    }
  }

  async findById(id: string): Promise<QuizSession | null> {
    const sessionData = await this.prisma.quizSession.findUnique({
      where: { id },
      include: { answers: true },
    });

    if (!sessionData) {
      return null;
    }

    return this.toDomain(sessionData);
  }

  async findByUserId(userId: string, status?: SessionStatus): Promise<QuizSession[]> {
    const sessions = await this.prisma.quizSession.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: { answers: true },
      orderBy: { startedAt: 'desc' },
    });

    return sessions.map((s) => this.toDomain(s));
  }

  async findActiveByUserId(userId: string): Promise<QuizSession | null> {
    const sessionData = await this.prisma.quizSession.findFirst({
      where: {
        userId,
        status: SessionStatus.IN_PROGRESS,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: { answers: true },
    });

    if (!sessionData) {
      return null;
    }

    return this.toDomain(sessionData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.quizSession.delete({ where: { id } });
  }

  private toDomain(data: any): QuizSession {
    const answers: SessionAnswerData[] = (data.answers || []).map((a: any) => ({
      questionId: a.questionId,
      answerId: a.answerId,
      isCorrect: a.isCorrect,
      timeSpent: a.timeSpent,
      pointsEarned: a.pointsEarned,
      timeBonus: a.timeBonus,
    }));

    return QuizSession.fromPersistence({
      id: data.id,
      userId: data.userId,
      categoryId: data.categoryId,
      difficultyId: data.difficultyId,
      status: data.status as SessionStatus,
      score: data.score,
      answers,
      startedAt: new Date(data.startedAt),
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}

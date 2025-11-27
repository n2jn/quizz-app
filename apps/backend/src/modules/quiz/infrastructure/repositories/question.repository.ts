import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
import { Question, QuestionStatus } from '../../domain/aggregates/question.aggregate';
import { QuestionText } from '../../domain/value-objects/question-text.vo';
import { Explanation } from '../../domain/value-objects/explanation.vo';
import { Answer } from '../../domain/entities/answer.entity';

/**
 * Question Repository Implementation
 *
 * Implements persistence for Question aggregate using Prisma.
 */
@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(question: Question): Promise<void> {
    await this.prisma.question.upsert({
      where: { id: question.id },
      create: {
        id: question.id,
        text: question.text.value,
        explanation: question.explanation.value,
        imageUrl: question.imageUrl,
        categoryId: question.categoryId,
        difficultyId: question.difficultyId,
        status: question.status,
        createdById: question.createdById,
        answers: {
          create: question.answers.map((answer) => ({
            id: answer.id,
            text: answer.text,
            isCorrect: answer.isCorrect,
          })),
        },
      },
      update: {
        text: question.text.value,
        explanation: question.explanation.value,
        imageUrl: question.imageUrl,
        status: question.status,
        updatedAt: new Date(),
      },
    });
  }

  async findById(id: string): Promise<Question | null> {
    const questionData = await this.prisma.question.findUnique({
      where: { id },
      include: { answers: true },
    });

    if (!questionData) {
      return null;
    }

    return this.toDomain(questionData);
  }

  async findByCategory(
    categoryId: string,
    status?: QuestionStatus,
  ): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        categoryId,
        ...(status && { status }),
      },
      include: { answers: true },
    });

    return questions.map((q) => this.toDomain(q));
  }

  async findByDifficulty(
    difficultyId: string,
    status?: QuestionStatus,
  ): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      where: {
        difficultyId,
        ...(status && { status }),
      },
      include: { answers: true },
    });

    return questions.map((q) => this.toDomain(q));
  }

  async findRandomQuestions(
    difficultyId: string,
    categoryId: string | null,
    count: number,
  ): Promise<Question[]> {
    // Use raw query for random sampling
    const questions = await this.prisma.$queryRaw<any[]>`
      SELECT q.*, json_agg(
        json_build_object(
          'id', a.id,
          'text', a.text,
          'isCorrect', a."isCorrect",
          'createdAt', a."createdAt",
          'updatedAt', a."updatedAt"
        )
      ) as answers
      FROM questions q
      LEFT JOIN answers a ON a."questionId" = q.id
      WHERE q."difficultyId" = ${difficultyId}
        AND q.status = 'PUBLISHED'
        ${categoryId ? `AND q."categoryId" = ${categoryId}` : ''}
      GROUP BY q.id
      ORDER BY RANDOM()
      LIMIT ${count}
    `;

    return questions.map((q) => this.toDomain(q));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }

  private toDomain(data: any): Question {
    const answers = (data.answers as any[]).map((a) =>
      Answer.fromPersistence({
        id: a.id,
        text: a.text,
        isCorrect: a.isCorrect,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
      }),
    );

    return Question.fromPersistence({
      id: data.id,
      text: QuestionText.create(data.text),
      explanation: Explanation.create(data.explanation),
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      difficultyId: data.difficultyId,
      status: data.status as QuestionStatus,
      createdById: data.createdById,
      answers,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}

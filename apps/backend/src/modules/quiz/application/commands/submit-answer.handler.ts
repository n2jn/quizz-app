import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubmitAnswerCommand } from './submit-answer.command';
import { IQuizSessionRepository } from '../../domain/repositories/quiz-session.repository.interface';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
import { SessionAnswerData } from '../../domain/aggregates/quiz-session.aggregate';

export interface SubmitAnswerResult {
  sessionId: string;
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeBonus: number;
  correctAnswerId: string;
}

/**
 * Submit Answer Command Handler
 *
 * Handles answer submission:
 * 1. Validate session exists and is active
 * 2. Validate question and answer exist
 * 3. Calculate points and time bonus
 * 4. Submit answer to session aggregate
 * 5. Persist updated session
 * 6. Return result with correct answer
 */
@Injectable()
@CommandHandler(SubmitAnswerCommand)
export class SubmitAnswerHandler
  implements ICommandHandler<SubmitAnswerCommand, SubmitAnswerResult>
{
  private static readonly BASE_POINTS = 100;
  private static readonly MAX_TIME_BONUS = 50;
  private static readonly TIME_BONUS_THRESHOLD_MS = 5000; // 5 seconds

  constructor(
    @Inject('IQuizSessionRepository')
    private readonly sessionRepository: IQuizSessionRepository,
    @Inject('IQuestionRepository')
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(command: SubmitAnswerCommand): Promise<SubmitAnswerResult> {
    // Get session
    const session = await this.sessionRepository.findById(command.sessionId);
    if (!session) {
      throw new NotFoundException('Quiz session not found');
    }

    // Get question
    const question = await this.questionRepository.findById(command.questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Validate answer exists for question
    const answer = question.answers.find((a) => a.id === command.answerId);
    if (!answer) {
      throw new BadRequestException('Invalid answer for question');
    }

    // Calculate points
    const isCorrect = answer.isCorrect;
    let pointsEarned = 0;
    let timeBonus = 0;

    if (isCorrect) {
      pointsEarned = SubmitAnswerHandler.BASE_POINTS;

      // Calculate time bonus (faster = more bonus)
      if (command.timeSpent < SubmitAnswerHandler.TIME_BONUS_THRESHOLD_MS) {
        const timeFactor =
          1 - command.timeSpent / SubmitAnswerHandler.TIME_BONUS_THRESHOLD_MS;
        timeBonus = Math.floor(SubmitAnswerHandler.MAX_TIME_BONUS * timeFactor);
      }
    }

    // Create session answer data
    const sessionAnswer: SessionAnswerData = {
      questionId: command.questionId,
      answerId: command.answerId,
      isCorrect,
      timeSpent: command.timeSpent,
      pointsEarned,
      timeBonus,
    };

    // Submit answer to session
    session.submitAnswer(sessionAnswer);

    // Save updated session
    await this.sessionRepository.save(session);

    // Find correct answer
    const correctAnswer = question.answers.find((a) => a.isCorrect);

    return {
      sessionId: command.sessionId,
      questionId: command.questionId,
      answerId: command.answerId,
      isCorrect,
      pointsEarned,
      timeBonus,
      correctAnswerId: correctAnswer!.id,
    };
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { StartQuizSessionCommand } from './start-quiz-session.command';
import { IQuizSessionRepository } from '../../domain/repositories/quiz-session.repository.interface';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
import { QuizSession } from '../../domain/aggregates/quiz-session.aggregate';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
import { v4 as uuidv4 } from 'uuid';

export interface StartQuizSessionResult {
  sessionId: string;
  userId: string;
  difficultyId: string;
  categoryId: string | null;
  questions: QuestionData[];
  expiresAt: Date;
}

export interface QuestionData {
  id: string;
  text: string;
  imageUrl: string | null;
  answers: AnswerData[];
}

export interface AnswerData {
  id: string;
  text: string;
}

/**
 * Start Quiz Session Command Handler
 *
 * Handles starting a new quiz session:
 * 1. Check if user has active session
 * 2. Fetch random questions for difficulty/category
 * 3. Create QuizSession aggregate
 * 4. Persist to database
 * 5. Publish QuizSessionStartedEvent
 * 6. Return questions (without correct answers)
 */
@Injectable()
@CommandHandler(StartQuizSessionCommand)
export class StartQuizSessionHandler
  implements ICommandHandler<StartQuizSessionCommand, StartQuizSessionResult>
{
  private static readonly SESSION_DURATION_MINUTES = 30;
  private static readonly QUESTIONS_PER_SESSION = 10;

  constructor(
    @Inject('IQuizSessionRepository')
    private readonly sessionRepository: IQuizSessionRepository,
    @Inject('IQuestionRepository')
    private readonly questionRepository: IQuestionRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: StartQuizSessionCommand): Promise<StartQuizSessionResult> {
    // Check for active session
    const activeSession = await this.sessionRepository.findActiveByUserId(
      command.userId,
    );
    if (activeSession) {
      throw new BadRequestException('User already has an active quiz session');
    }

    // Fetch random questions
    const questions = await this.questionRepository.findRandomQuestions(
      command.difficultyId,
      command.categoryId || null,
      StartQuizSessionHandler.QUESTIONS_PER_SESSION,
    );

    if (questions.length < StartQuizSessionHandler.QUESTIONS_PER_SESSION) {
      throw new BadRequestException(
        'Not enough questions available for this difficulty/category',
      );
    }

    // Create quiz session
    const sessionId = uuidv4();
    const session = QuizSession.create(
      sessionId,
      command.userId,
      command.categoryId || null,
      command.difficultyId,
      StartQuizSessionHandler.SESSION_DURATION_MINUTES,
    );

    // Save session
    await this.sessionRepository.save(session);

    // Publish domain events
    await this.eventBus.publishAll([...session.domainEvents]);
    session.clearEvents();

    // Return questions without correct answer indicators
    const questionData: QuestionData[] = questions.map((q) => ({
      id: q.id,
      text: q.text.value,
      imageUrl: q.imageUrl,
      answers: q.answers.map((a) => ({
        id: a.id,
        text: a.text,
      })),
    }));

    return {
      sessionId: session.id,
      userId: command.userId,
      difficultyId: command.difficultyId,
      categoryId: command.categoryId || null,
      questions: questionData,
      expiresAt: session.expiresAt,
    };
  }
}

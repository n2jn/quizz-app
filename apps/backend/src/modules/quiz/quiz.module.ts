import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from '@shared/shared.module';

// Controllers
import { QuizController } from './presentation/controllers/quiz.controller';
import { QuestionController } from './presentation/controllers/question.controller';

// Command Handlers
import { CreateQuestionHandler } from './application/commands/create-question.handler';
import { StartQuizSessionHandler } from './application/commands/start-quiz-session.handler';
import { SubmitAnswerHandler } from './application/commands/submit-answer.handler';
import { CompleteQuizSessionHandler } from './application/commands/complete-quiz-session.handler';

// Repositories
import { QuestionRepository } from './infrastructure/repositories/question.repository';
import { QuizSessionRepository } from './infrastructure/repositories/quiz-session.repository';

const CommandHandlers = [
  CreateQuestionHandler,
  StartQuizSessionHandler,
  SubmitAnswerHandler,
  CompleteQuizSessionHandler,
];

const Repositories = [
  {
    provide: 'IQuestionRepository',
    useClass: QuestionRepository,
  },
  {
    provide: 'IQuizSessionRepository',
    useClass: QuizSessionRepository,
  },
];

/**
 * Quiz Bounded Context
 *
 * Responsibilities:
 * - Quiz session management
 * - Question selection and delivery
 * - Answer submission and validation
 * - Score calculation
 * - Time tracking and anti-cheat
 *
 * Domain Events Emitted:
 * - QuizSessionStartedEvent
 * - QuizSessionCompletedEvent
 * - QuestionCreatedEvent
 */
@Module({
  imports: [CqrsModule, SharedModule],
  controllers: [QuizController, QuestionController],
  providers: [...CommandHandlers, ...Repositories],
  exports: [],
})
export class QuizModule {}

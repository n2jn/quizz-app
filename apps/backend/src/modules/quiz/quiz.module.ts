import { Module } from '@nestjs/common';

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
 * - QuizStartedEvent
 * - QuestionAnsweredEvent
 * - QuizCompletedEvent
 * - PerfectScoreAchievedEvent
 * - QuizAbandonedEvent
 */
@Module({
  imports: [],
  providers: [],
  controllers: [],
  exports: [],
})
export class QuizModule {}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { CreateQuestionCommand } from './create-question.command';
import { IQuestionRepository } from '../../domain/repositories/question.repository.interface';
import { QuestionText } from '../../domain/value-objects/question-text.vo';
import { Explanation } from '../../domain/value-objects/explanation.vo';
import { Question } from '../../domain/aggregates/question.aggregate';
import { Answer } from '../../domain/entities/answer.entity';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
import { v4 as uuidv4 } from 'uuid';

export interface CreateQuestionResult {
  questionId: string;
  text: string;
  categoryId: string;
  difficultyId: string;
}

/**
 * Create Question Command Handler
 *
 * Handles question creation:
 * 1. Validate question text and explanation
 * 2. Create answers with validation
 * 3. Create Question aggregate
 * 4. Persist to database
 * 5. Publish QuestionCreatedEvent
 */
@Injectable()
@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionCommand, CreateQuestionResult>
{
  constructor(
    @Inject('IQuestionRepository')
    private readonly questionRepository: IQuestionRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: CreateQuestionCommand): Promise<CreateQuestionResult> {
    const questionText = QuestionText.create(command.text);
    const explanation = Explanation.create(command.explanation);

    // Create answer entities
    const answers = command.answers.map((answerDto) =>
      Answer.create(uuidv4(), answerDto.text, answerDto.isCorrect),
    );

    // Create question aggregate
    const questionId = uuidv4();
    const question = Question.create(
      questionId,
      questionText,
      explanation,
      command.categoryId,
      command.difficultyId,
      command.createdById,
      answers,
      command.imageUrl || null,
    );

    // Save question
    await this.questionRepository.save(question);

    // Publish domain events
    await this.eventBus.publishAll([...question.domainEvents]);
    question.clearEvents();

    return {
      questionId: question.id,
      text: questionText.value,
      categoryId: command.categoryId,
      difficultyId: command.difficultyId,
    };
  }
}

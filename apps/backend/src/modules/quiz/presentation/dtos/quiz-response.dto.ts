import { ApiProperty } from '@nestjs/swagger';

export class AnswerOptionDto {
  @ApiProperty({ example: 'answer-uuid', description: 'Answer ID' })
  id!: string;

  @ApiProperty({ example: 'Paris', description: 'Answer text' })
  text!: string;
}

export class QuestionDto {
  @ApiProperty({ example: 'question-uuid', description: 'Question ID' })
  id!: string;

  @ApiProperty({ example: 'What is the capital of France?', description: 'Question text' })
  text!: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Optional image URL',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({ type: [AnswerOptionDto], description: 'Answer options' })
  answers!: AnswerOptionDto[];
}

export class StartQuizResponseDto {
  @ApiProperty({ example: 'session-uuid', description: 'Quiz session ID' })
  sessionId!: string;

  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  userId!: string;

  @ApiProperty({ example: 'diff-apprenti-uuid', description: 'Difficulty ID' })
  difficultyId!: string;

  @ApiProperty({
    example: 'cat-geography-uuid',
    description: 'Category ID',
    nullable: true,
  })
  categoryId!: string | null;

  @ApiProperty({ type: [QuestionDto], description: 'Quiz questions' })
  questions!: QuestionDto[];

  @ApiProperty({ example: '2024-01-01T12:30:00Z', description: 'Session expiration time' })
  expiresAt!: Date;
}

export class SubmitAnswerResponseDto {
  @ApiProperty({ example: 'session-uuid', description: 'Session ID' })
  sessionId!: string;

  @ApiProperty({ example: 'question-uuid', description: 'Question ID' })
  questionId!: string;

  @ApiProperty({ example: 'answer-uuid', description: 'Submitted answer ID' })
  answerId!: string;

  @ApiProperty({ example: true, description: 'Whether answer was correct' })
  isCorrect!: boolean;

  @ApiProperty({ example: 100, description: 'Points earned for correct answer' })
  pointsEarned!: number;

  @ApiProperty({ example: 25, description: 'Time bonus points' })
  timeBonus!: number;

  @ApiProperty({ example: 'correct-answer-uuid', description: 'ID of correct answer' })
  correctAnswerId!: string;
}

export class CompleteQuizResponseDto {
  @ApiProperty({ example: 'session-uuid', description: 'Session ID' })
  sessionId!: string;

  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  userId!: string;

  @ApiProperty({ example: 850, description: 'Total score' })
  score!: number;

  @ApiProperty({ example: 10, description: 'Total number of questions' })
  totalQuestions!: number;

  @ApiProperty({ example: 7, description: 'Number of correct answers' })
  correctAnswers!: number;

  @ApiProperty({ example: '2024-01-01T12:30:00Z', description: 'Completion time' })
  completedAt!: Date;
}

export class CreateQuestionResponseDto {
  @ApiProperty({ example: 'question-uuid', description: 'Question ID' })
  questionId!: string;

  @ApiProperty({ example: 'What is the capital of France?', description: 'Question text' })
  text!: string;

  @ApiProperty({ example: 'cat-geography-uuid', description: 'Category ID' })
  categoryId!: string;

  @ApiProperty({ example: 'diff-apprenti-uuid', description: 'Difficulty ID' })
  difficultyId!: string;
}

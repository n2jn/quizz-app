import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ example: 'question-uuid', description: 'Question ID' })
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @ApiProperty({ example: 'answer-uuid', description: 'Selected answer ID' })
  @IsString()
  @IsNotEmpty()
  answerId!: string;

  @ApiProperty({ example: 3500, description: 'Time spent answering in milliseconds' })
  @IsInt()
  @Min(0)
  timeSpent!: number;
}

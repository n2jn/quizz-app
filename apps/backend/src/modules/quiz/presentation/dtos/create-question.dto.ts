import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsOptional, IsUrl, MinLength, MaxLength } from 'class-validator';

export class CreateQuestionAnswerDto {
  @ApiProperty({ example: 'Paris', description: 'Answer text' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  text: string;

  @ApiProperty({ example: true, description: 'Whether this is the correct answer' })
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is the capital of France?', description: 'Question text' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  text: string;

  @ApiProperty({
    example: 'Paris is the capital and most populous city of France.',
    description: 'Explanation of the answer',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(2000)
  explanation: string;

  @ApiProperty({ example: 'cat-geography-uuid', description: 'Category ID' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'diff-apprenti-uuid', description: 'Difficulty ID' })
  @IsString()
  @IsNotEmpty()
  difficultyId: string;

  @ApiProperty({
    type: [CreateQuestionAnswerDto],
    description: 'Answer options (2-6)',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  answers: CreateQuestionAnswerDto[];

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Optional image URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

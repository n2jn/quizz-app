import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class StartQuizDto {
  @ApiProperty({ example: 'diff-apprenti-uuid', description: 'Difficulty level ID' })
  @IsString()
  @IsNotEmpty()
  difficultyId: string;

  @ApiProperty({
    example: 'cat-geography-uuid',
    description: 'Optional category ID for category-specific quiz',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

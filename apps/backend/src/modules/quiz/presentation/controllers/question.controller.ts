import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { Roles } from '@shared/presentation/decorators/roles.decorator';
import { RolesGuard } from '@shared/presentation/guards/roles.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { CreateQuestionDto, CreateQuestionResponseDto } from '../dtos';
import { CreateQuestionCommand } from '../../application/commands/create-question.command';

/**
 * Question Controller
 *
 * Handles question management operations.
 * Admin-only endpoints for creating quiz questions.
 */
@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new question (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
    type: CreateQuestionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid question data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async createQuestion(
    @CurrentUser() user: any,
    @Body() dto: CreateQuestionDto,
  ): Promise<CreateQuestionResponseDto> {
    const result = await this.commandBus.execute(
      new CreateQuestionCommand(
        dto.text,
        dto.explanation,
        dto.categoryId,
        dto.difficultyId,
        user.userId,
        dto.answers,
        dto.imageUrl,
      ),
    );

    return result;
  }
}

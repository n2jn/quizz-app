import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import {
  StartQuizDto,
  SubmitAnswerDto,
  StartQuizResponseDto,
  SubmitAnswerResponseDto,
  CompleteQuizResponseDto,
} from '../dtos';
import { StartQuizSessionCommand } from '../../application/commands/start-quiz-session.command';
import { SubmitAnswerCommand } from '../../application/commands/submit-answer.command';
import { CompleteQuizSessionCommand } from '../../application/commands/complete-quiz-session.command';

/**
 * Quiz Controller
 *
 * Handles quiz session operations:
 * - Starting a new quiz
 * - Submitting answers
 * - Completing quiz
 */
@ApiTags('quiz')
@ApiBearerAuth()
@Controller('quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a new quiz session' })
  @ApiResponse({
    status: 200,
    description: 'Quiz session started successfully',
    type: StartQuizResponseDto,
  })
  @ApiResponse({ status: 400, description: 'User already has active session or not enough questions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async startQuiz(
    @CurrentUser() user: any,
    @Body() dto: StartQuizDto,
  ): Promise<StartQuizResponseDto> {
    const result = await this.commandBus.execute(
      new StartQuizSessionCommand(user.userId, dto.difficultyId, dto.categoryId),
    );

    return result;
  }

  @Post('sessions/:sessionId/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit an answer for a question' })
  @ApiResponse({
    status: 200,
    description: 'Answer submitted successfully',
    type: SubmitAnswerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid answer or session expired' })
  @ApiResponse({ status: 404, description: 'Session or question not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitAnswerDto,
  ): Promise<SubmitAnswerResponseDto> {
    const result = await this.commandBus.execute(
      new SubmitAnswerCommand(
        sessionId,
        dto.questionId,
        dto.answerId,
        dto.timeSpent,
      ),
    );

    return result;
  }

  @Post('sessions/:sessionId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete a quiz session' })
  @ApiResponse({
    status: 200,
    description: 'Quiz session completed successfully',
    type: CompleteQuizResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 400, description: 'Session not in progress' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async completeQuiz(
    @Param('sessionId') sessionId: string,
  ): Promise<CompleteQuizResponseDto> {
    const result = await this.commandBus.execute(
      new CompleteQuizSessionCommand(sessionId),
    );

    return result;
  }
}

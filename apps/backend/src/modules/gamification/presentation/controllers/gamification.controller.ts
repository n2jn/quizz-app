import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { GetProgressQuery } from '../../application/queries/get-progress.query';

@ApiTags('gamification')
@ApiBearerAuth()
@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('progress')
  @ApiOperation({ summary: 'Get player progress' })
  @ApiResponse({ status: 200, description: 'Progress retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProgress(@CurrentUser() user: any) {
    return this.queryBus.execute(new GetProgressQuery(user.userId));
  }
}

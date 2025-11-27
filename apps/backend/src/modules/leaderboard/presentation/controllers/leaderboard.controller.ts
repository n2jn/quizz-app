import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { GetLeaderboardQuery } from '../../application/queries/get-leaderboard.query';

@ApiTags('leaderboard')
@ApiBearerAuth()
@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiQuery({ name: 'type', enum: ['global', 'weekly'], required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLeaderboard(
    @Query('type') type: 'global' | 'weekly' = 'global',
    @Query('limit') limit: number = 100,
  ) {
    return this.queryBus.execute(new GetLeaderboardQuery(type, limit));
  }
}

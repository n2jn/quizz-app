import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import {
  PurchaseItemDto,
  PurchaseItemResponseDto,
  WalletResponseDto,
  LivesResponseDto,
  ShopItemDto,
} from '../dtos/purchase-item.dto';
import { PurchaseItemCommand } from '../../application/commands/purchase-item.command';
import { GetWalletQuery } from '../../application/queries/get-wallet.query';
import { GetLivesQuery } from '../../application/queries/get-lives.query';

/**
 * Economy Controller
 *
 * Handles economy operations:
 * - Wallet management
 * - Lives system
 * - Shop purchases
 */
@ApiTags('economy')
@ApiBearerAuth()
@Controller('economy')
@UseGuards(JwtAuthGuard)
export class EconomyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly prisma: PrismaService,
  ) {}

  @Get('wallet')
  @ApiOperation({ summary: 'Get user wallet information' })
  @ApiResponse({
    status: 200,
    description: 'Wallet information retrieved',
    type: WalletResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWallet(@CurrentUser() user: any): Promise<WalletResponseDto> {
    return this.queryBus.execute(new GetWalletQuery(user.userId));
  }

  @Get('lives')
  @ApiOperation({ summary: 'Get user lives status' })
  @ApiResponse({
    status: 200,
    description: 'Lives status retrieved',
    type: LivesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLives(@CurrentUser() user: any): Promise<LivesResponseDto> {
    return this.queryBus.execute(new GetLivesQuery(user.userId));
  }

  @Get('shop')
  @ApiOperation({ summary: 'Get available shop items' })
  @ApiResponse({
    status: 200,
    description: 'Shop items retrieved',
    type: [ShopItemDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getShopItems(): Promise<ShopItemDto[]> {
    const items = await this.prisma.shopItem.findMany({
      where: { available: true },
    });

    return items.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      description: item.description,
      price: item.price,
      available: item.available,
    }));
  }

  @Post('shop/purchase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Purchase a shop item' })
  @ApiResponse({
    status: 200,
    description: 'Item purchased successfully',
    type: PurchaseItemResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Insufficient balance or item unavailable' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async purchaseItem(
    @CurrentUser() user: any,
    @Body() dto: PurchaseItemDto,
  ): Promise<PurchaseItemResponseDto> {
    return this.commandBus.execute(
      new PurchaseItemCommand(user.userId, dto.itemId),
    );
  }
}

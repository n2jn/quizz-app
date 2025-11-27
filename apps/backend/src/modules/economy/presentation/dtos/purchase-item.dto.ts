import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PurchaseItemDto {
  @ApiProperty({ example: 'item-uuid', description: 'Shop item ID to purchase' })
  @IsString()
  @IsNotEmpty()
  itemId: string;
}

export class PurchaseItemResponseDto {
  @ApiProperty({ example: 'item-uuid', description: 'Purchased item ID' })
  itemId: string;

  @ApiProperty({ example: 'Extra Life', description: 'Item name' })
  itemName: string;

  @ApiProperty({ example: 100, description: 'Price paid' })
  price: number;

  @ApiProperty({ example: 450, description: 'Balance after purchase' })
  balanceAfter: number;
}

export class WalletResponseDto {
  @ApiProperty({ example: 550, description: 'Current balance' })
  balance: number;

  @ApiProperty({ example: 1200, description: 'Total coins earned' })
  lifetimeEarned: number;

  @ApiProperty({ example: 650, description: 'Total coins spent' })
  lifetimeSpent: number;
}

export class LivesResponseDto {
  @ApiProperty({ example: 3, description: 'Current lives' })
  currentLives: number;

  @ApiProperty({ example: 5, description: 'Maximum lives' })
  maxLives: number;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Last regeneration time',
    nullable: true,
  })
  lastRegenAt: Date | null;
}

export class ShopItemDto {
  @ApiProperty({ example: 'item-uuid', description: 'Item ID' })
  id: string;

  @ApiProperty({ example: 'LIFE', description: 'Item type' })
  type: string;

  @ApiProperty({ example: 'Extra Life', description: 'Item name' })
  name: string;

  @ApiProperty({ example: 'Restore one life to your health bar', description: 'Item description' })
  description: string;

  @ApiProperty({ example: 100, description: 'Price in coins' })
  price: number;

  @ApiProperty({ example: true, description: 'Whether item is available' })
  available: boolean;
}

export declare class PurchaseItemDto {
    itemId: string;
}
export declare class PurchaseItemResponseDto {
    itemId: string;
    itemName: string;
    price: number;
    balanceAfter: number;
}
export declare class WalletResponseDto {
    balance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
}
export declare class LivesResponseDto {
    currentLives: number;
    maxLives: number;
    lastRegenAt: Date | null;
}
export declare class ShopItemDto {
    id: string;
    type: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
}

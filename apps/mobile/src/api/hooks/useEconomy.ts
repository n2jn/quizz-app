import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiError } from '../client';
import { ENDPOINTS, QUERY_KEYS } from '../../utils/constants';

/**
 * Type Definitions
 * TODO: Import from @quizz-app/shared-types once linked
 */
interface WalletDto {
  id: string;
  userId: string;
  coins: number;
  lives: number;
  maxLives: number;
  lastLifeRegenAt: Date;
  updatedAt: Date;
}

interface PurchaseItemDto {
  itemId: string;
  quantity?: number;
}

interface PurchaseResponseDto {
  success: boolean;
  newBalance: number;
  item: {
    id: string;
    name: string;
    type: string;
  };
}

interface ShopItemDto {
  id: string;
  name: string;
  description: string;
  type: 'POWER_UP' | 'LIFE_PACK' | 'COSMETIC';
  cost: number;
  value: number;
  isAvailable: boolean;
}

/**
 * useWallet Hook
 *
 * Fetches wallet balance (coins and lives)
 */
export function useWallet() {
  return useQuery({
    queryKey: QUERY_KEYS.WALLET,
    queryFn: async (): Promise<WalletDto> => {
      const response = await apiClient.get<WalletDto>(ENDPOINTS.WALLET);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * useLives Hook
 *
 * Fetches lives data and regeneration status
 */
export function useLives() {
  return useQuery({
    queryKey: QUERY_KEYS.LIVES,
    queryFn: async (): Promise<WalletDto> => {
      const response = await apiClient.get<WalletDto>(ENDPOINTS.LIVES);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute to update regeneration
  });
}

/**
 * usePurchaseItem Hook
 *
 * Purchases an item from the shop
 */
export function usePurchaseItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PurchaseItemDto): Promise<PurchaseResponseDto> => {
      const response = await apiClient.post<PurchaseResponseDto>(
        ENDPOINTS.SHOP_PURCHASE,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate wallet to refetch updated balance
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHOP_ITEMS });
    },
    onError: (error) => {
      const message = handleApiError(error);
      console.error('Purchase item error:', message);
    },
  });
}

/**
 * useShopItems Hook
 *
 * Fetches available shop items
 */
export function useShopItems() {
  return useQuery({
    queryKey: QUERY_KEYS.SHOP_ITEMS,
    queryFn: async (): Promise<ShopItemDto[]> => {
      const response = await apiClient.get<ShopItemDto[]>(ENDPOINTS.SHOP_ITEMS);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * useShopItem Hook
 *
 * Fetches a specific shop item by ID
 */
export function useShopItem(itemId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.SHOP_ITEM(itemId || ''),
    queryFn: async (): Promise<ShopItemDto> => {
      const response = await apiClient.get<ShopItemDto>(
        `/economy/shop/items/${itemId}`
      );
      return response.data;
    },
    enabled: !!itemId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

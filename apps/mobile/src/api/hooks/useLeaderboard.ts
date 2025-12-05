import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS, QUERY_KEYS } from '../../utils/constants';

/**
 * Type Definitions
 * TODO: Import from @quizz-app/shared-types once linked
 */
interface LeaderboardEntryDto {
  rank: number;
  userId: string;
  username: string;
  name: string;
  score: number;
  level: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardResponseDto {
  entries: LeaderboardEntryDto[];
  userEntry?: LeaderboardEntryDto;
  totalEntries: number;
}

type LeaderboardType = 'GLOBAL' | 'WEEKLY' | 'MONTHLY';

/**
 * useLeaderboard Hook
 *
 * Fetches leaderboard data
 */
export function useLeaderboard(
  type: LeaderboardType = 'GLOBAL',
  limit: number = 50
) {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERBOARD(type, limit),
    queryFn: async (): Promise<LeaderboardResponseDto> => {
      const response = await apiClient.get<LeaderboardResponseDto>(
        ENDPOINTS.LEADERBOARD,
        {
          params: { type, limit },
        }
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * useGlobalLeaderboard Hook
 *
 * Fetches global leaderboard
 */
export function useGlobalLeaderboard(limit: number = 50) {
  return useLeaderboard('GLOBAL', limit);
}

/**
 * useWeeklyLeaderboard Hook
 *
 * Fetches weekly leaderboard
 */
export function useWeeklyLeaderboard(limit: number = 50) {
  return useLeaderboard('WEEKLY', limit);
}

/**
 * useMonthlyLeaderboard Hook
 *
 * Fetches monthly leaderboard
 */
export function useMonthlyLeaderboard(limit: number = 50) {
  return useLeaderboard('MONTHLY', limit);
}

/**
 * useUserRank Hook
 *
 * Fetches current user's rank on the leaderboard
 */
export function useUserRank(type: LeaderboardType = 'GLOBAL') {
  return useQuery({
    queryKey: QUERY_KEYS.USER_RANK(type),
    queryFn: async (): Promise<LeaderboardEntryDto> => {
      const response = await apiClient.get<LeaderboardEntryDto>(
        `/leaderboard/me`,
        {
          params: { type },
        }
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

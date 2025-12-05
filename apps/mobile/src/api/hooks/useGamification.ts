import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS, QUERY_KEYS } from '../../utils/constants';

/**
 * Type Definitions
 * TODO: Import from @quizz-app/shared-types once linked
 */
interface ProgressDto {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  longestStreak: number;
  currentStreak: number;
}

interface BadgeDto {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  criteria: {
    type: string;
    value: number;
  };
}

interface UserBadgeDto {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: BadgeDto;
}

interface AchievementDto {
  id: string;
  name: string;
  description: string;
  category: string;
  points: number;
  isUnlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: Date;
}

/**
 * useProgress Hook
 *
 * Fetches user progress and statistics
 */
export function useProgress() {
  return useQuery({
    queryKey: QUERY_KEYS.PROGRESS,
    queryFn: async (): Promise<ProgressDto> => {
      const response = await apiClient.get<ProgressDto>(ENDPOINTS.PROGRESS);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * useBadges Hook
 *
 * Fetches all available badges
 */
export function useBadges() {
  return useQuery({
    queryKey: QUERY_KEYS.BADGES,
    queryFn: async (): Promise<BadgeDto[]> => {
      const response = await apiClient.get<BadgeDto[]>(ENDPOINTS.BADGES);
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * useUserBadges Hook
 *
 * Fetches user's earned badges
 */
export function useUserBadges() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_BADGES,
    queryFn: async (): Promise<UserBadgeDto[]> => {
      const response = await apiClient.get<UserBadgeDto[]>(
        ENDPOINTS.USER_BADGES
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * useAchievements Hook
 *
 * Fetches user achievements and progress
 */
export function useAchievements() {
  return useQuery({
    queryKey: QUERY_KEYS.ACHIEVEMENTS,
    queryFn: async (): Promise<AchievementDto[]> => {
      const response = await apiClient.get<AchievementDto[]>(
        ENDPOINTS.ACHIEVEMENTS
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * useStats Hook
 *
 * Fetches detailed user statistics
 */
export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: async (): Promise<ProgressDto> => {
      const response = await apiClient.get<ProgressDto>(
        '/gamification/stats'
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

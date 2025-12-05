import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiError } from '../client';
import { ENDPOINTS, QUERY_KEYS } from '../../utils/constants';
import { tokenStorage, userStorage, clearAllData } from '../../utils/storage';

/**
 * Type Definitions
 * TODO: Import from @quizz-app/shared-types once linked
 */
interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  username: string;
  name: string;
  password: string;
}

interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
  };
}

interface UserDto {
  id: string;
  email: string;
  username: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * useLogin Hook
 *
 * Handles user login and token storage
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginDto): Promise<AuthResponseDto> => {
      const response = await apiClient.post<AuthResponseDto>(
        ENDPOINTS.LOGIN,
        credentials
      );
      return response.data;
    },
    onSuccess: async (data) => {
      // Store tokens
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);

      // Store user data
      await userStorage.setUser(data.user);

      // Set user data in query cache
      queryClient.setQueryData(QUERY_KEYS.PROFILE, data.user);
    },
    onError: (error) => {
      const message = handleApiError(error);
      console.error('Login error:', message);
    },
  });
}

/**
 * useRegister Hook
 *
 * Handles user registration and token storage
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterDto): Promise<AuthResponseDto> => {
      const response = await apiClient.post<AuthResponseDto>(
        ENDPOINTS.REGISTER,
        data
      );
      return response.data;
    },
    onSuccess: async (data) => {
      // Store tokens
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);

      // Store user data
      await userStorage.setUser(data.user);

      // Set user data in query cache
      queryClient.setQueryData(QUERY_KEYS.PROFILE, data.user);
    },
    onError: (error) => {
      const message = handleApiError(error);
      console.error('Registration error:', message);
    },
  });
}

/**
 * useProfile Hook
 *
 * Fetches current user profile
 */
export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: async (): Promise<UserDto> => {
      const response = await apiClient.get<UserDto>(ENDPOINTS.PROFILE);
      return response.data;
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * useLogout Hook
 *
 * Handles user logout and clears data
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear all stored data
      await clearAllData();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
    },
  });
}

/**
 * useIsAuthenticated Hook
 *
 * Checks if user is authenticated
 */
export function useIsAuthenticated() {
  return useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: async (): Promise<boolean> => {
      const token = await tokenStorage.getAccessToken();
      return !!token;
    },
    staleTime: Infinity,
  });
}

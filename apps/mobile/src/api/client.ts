import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../utils/constants';
import { tokenStorage, clearAllData } from '../utils/storage';

/**
 * Axios API Client
 *
 * Configured with:
 * - Base URL
 * - Request interceptor for auth tokens
 * - Response interceptor for error handling
 * - Token refresh logic
 */

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();

        if (!refreshToken) {
          // No refresh token, logout user
          await clearAllData();
          return Promise.reject(error);
        }

        // Try to refresh the access token
        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.REFRESH}`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        await tokenStorage.setTokens(accessToken, newRefreshToken);

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await clearAllData();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

/**
 * API Error Handler
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (message) {
      return Array.isArray(message) ? message[0] : message;
    }

    if (error.response?.status === 401) {
      return 'Unauthorized. Please login again.';
    }

    if (error.response?.status === 403) {
      return 'Access forbidden.';
    }

    if (error.response?.status === 404) {
      return 'Resource not found.';
    }

    if (error.response?.status === 500) {
      return 'Server error. Please try again later.';
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection.';
    }

    if (error.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }

    return error.message || 'An unexpected error occurred.';
  }

  return 'An unexpected error occurred.';
};

export default apiClient;

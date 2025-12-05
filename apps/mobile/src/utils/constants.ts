/**
 * App Constants
 */

// API Configuration
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3001/api/v1'
  : 'https://api.quizz-app.com/api/v1';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@quizz_app:access_token',
  REFRESH_TOKEN: '@quizz_app:refresh_token',
  USER: '@quizz_app:user',
} as const;

// Query Keys
export const QUERY_KEYS = {
  // Auth
  PROFILE: ['profile'],

  // Quiz
  QUIZ_SESSION: (sessionId: string) => ['quiz', 'session', sessionId],
  QUIZ_SESSIONS: ['quiz', 'sessions'],

  // Economy
  WALLET: ['economy', 'wallet'],
  LIVES: ['economy', 'lives'],
  SHOP: ['economy', 'shop'],

  // Gamification
  PROGRESS: ['gamification', 'progress'],
  BADGES: ['gamification', 'badges'],

  // Leaderboard
  LEADERBOARD: ['leaderboard'],
} as const;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/me',

  // Quiz
  START_QUIZ: '/quiz/start',
  SUBMIT_ANSWER: (sessionId: string) => `/quiz/sessions/${sessionId}/answer`,
  COMPLETE_QUIZ: (sessionId: string) => `/quiz/sessions/${sessionId}/complete`,

  // Economy
  WALLET: '/economy/wallet',
  LIVES: '/economy/lives',
  SHOP: '/economy/shop',
  PURCHASE: '/economy/shop/purchase',

  // Gamification
  PROGRESS: '/gamification/progress',

  // Leaderboard
  LEADERBOARD: '/leaderboard',
} as const;

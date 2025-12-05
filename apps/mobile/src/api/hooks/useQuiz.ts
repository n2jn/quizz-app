import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiError } from '../client';
import { ENDPOINTS, QUERY_KEYS } from '../../utils/constants';

/**
 * Type Definitions
 * TODO: Import from @quizz-app/shared-types once linked
 */
interface StartQuizDto {
  categoryId?: string;
  difficultyId: string;
}

interface SubmitAnswerDto {
  questionId: string;
  answerId: string;
  timeSpent: number;
}

interface QuizSessionDto {
  id: string;
  userId: string;
  categoryId?: string;
  difficultyId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  score: number;
  startedAt: Date;
  completedAt?: Date;
  expiresAt: Date;
  currentQuestion?: {
    id: string;
    text: string;
    answers: Array<{
      id: string;
      text: string;
    }>;
  };
}

interface SubmitAnswerResponseDto {
  isCorrect: boolean;
  correctAnswerId: string;
  pointsEarned: number;
  timeBonus: number;
  explanation?: string;
  nextQuestion?: {
    id: string;
    text: string;
    answers: Array<{
      id: string;
      text: string;
    }>;
  };
}

interface CompleteQuizResponseDto {
  sessionId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  coinsEarned: number;
  xpEarned: number;
}

/**
 * useStartQuiz Hook
 *
 * Starts a new quiz session
 */
export function useStartQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StartQuizDto): Promise<QuizSessionDto> => {
      const response = await apiClient.post<QuizSessionDto>(
        ENDPOINTS.START_QUIZ,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Cache the new quiz session
      queryClient.setQueryData(QUERY_KEYS.QUIZ_SESSION(data.id), data);

      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ_SESSIONS });
    },
    onError: (error) => {
      const message = handleApiError(error);
      console.error('Start quiz error:', message);
    },
  });
}

/**
 * useQuizSession Hook
 *
 * Fetches quiz session details
 */
export function useQuizSession(sessionId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZ_SESSION(sessionId || ''),
    queryFn: async (): Promise<QuizSessionDto> => {
      const response = await apiClient.get<QuizSessionDto>(
        `/quiz/sessions/${sessionId}`
      );
      return response.data;
    },
    enabled: !!sessionId,
  });
}

/**
 * useSubmitAnswer Hook
 *
 * Submits an answer for a quiz question
 */
export function useSubmitAnswer(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitAnswerDto): Promise<SubmitAnswerResponseDto> => {
      const response = await apiClient.post<SubmitAnswerResponseDto>(
        ENDPOINTS.SUBMIT_ANSWER(sessionId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate quiz session to refetch updated data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_SESSION(sessionId),
      });
    },
    onError: (error) => {
      const message = handleApiError(error);
      console.error('Submit answer error:', message);
    },
  });
}

/**
 * useCompleteQuiz Hook
 *
 * Completes a quiz session
 */
export function useCompleteQuiz(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<CompleteQuizResponseDto> => {
      const response = await apiClient.post<CompleteQuizResponseDto>(
        ENDPOINTS.COMPLETE_QUIZ(sessionId)
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZ_SESSION(sessionId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZ_SESSIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WALLET });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROGRESS });
    },
    onError: (error) => {
      const message = handleApiError(error);
      console.error('Complete quiz error:', message);
    },
  });
}

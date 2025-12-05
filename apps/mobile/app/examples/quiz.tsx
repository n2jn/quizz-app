import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {
  useStartQuiz,
  useQuizSession,
  useSubmitAnswer,
  useCompleteQuiz,
} from '../../src/api/hooks/useQuiz';
import { useRouter } from 'expo-router';

/**
 * Example Quiz Screen
 *
 * Demonstrates:
 * - useStartQuiz hook to start a quiz session
 * - useQuizSession hook to fetch current question
 * - useSubmitAnswer hook to submit answers
 * - useCompleteQuiz hook to finish the quiz
 * - Timer implementation
 * - Dynamic UI based on quiz state
 */
export default function QuizScreen() {
  const router = useRouter();
  const startQuiz = useStartQuiz();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { data: session, isLoading: sessionLoading } = useQuizSession(sessionId);
  const submitAnswer = useSubmitAnswer(sessionId || '');
  const completeQuiz = useCompleteQuiz(sessionId || '');

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  // Timer effect
  useEffect(() => {
    if (session?.currentQuestion && !showResult) {
      const interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session?.currentQuestion, showResult]);

  const handleStartQuiz = async (difficultyId: string) => {
    try {
      const newSession = await startQuiz.mutateAsync({
        difficultyId,
      });
      setSessionId(newSession.id);
      setTimeSpent(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to start quiz. Please try again.');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswerId || !session?.currentQuestion) {
      Alert.alert('Error', 'Please select an answer');
      return;
    }

    try {
      const result = await submitAnswer.mutateAsync({
        questionId: session.currentQuestion.id,
        answerId: selectedAnswerId,
        timeSpent,
      });

      setLastResult(result);
      setShowResult(true);

      // Reset for next question
      setTimeout(() => {
        if (result.nextQuestion) {
          setSelectedAnswerId(null);
          setTimeSpent(0);
          setShowResult(false);
          setLastResult(null);
        } else {
          // No more questions, complete the quiz
          handleCompleteQuiz();
        }
      }, 3000);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    }
  };

  const handleCompleteQuiz = async () => {
    try {
      const result = await completeQuiz.mutateAsync();
      Alert.alert(
        'Quiz Completed!',
        `Score: ${result.score}\nCorrect Answers: ${result.correctAnswers}/${result.totalQuestions}\nCoins Earned: ${result.coinsEarned}\nXP Earned: ${result.xpEarned}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete quiz.');
    }
  };

  // Start screen
  if (!sessionId) {
    return (
      <View style={styles.container}>
        <View style={styles.startContainer}>
          <Text style={styles.title}>Start a Quiz</Text>
          <Text style={styles.subtitle}>Choose your difficulty level</Text>

          <TouchableOpacity
            style={[styles.difficultyButton, styles.easyButton]}
            onPress={() => handleStartQuiz('easy')}
            disabled={startQuiz.isPending}
          >
            <Text style={styles.difficultyButtonText}>Easy</Text>
            <Text style={styles.difficultyDescription}>
              Simple questions for beginners
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.difficultyButton, styles.mediumButton]}
            onPress={() => handleStartQuiz('medium')}
            disabled={startQuiz.isPending}
          >
            <Text style={styles.difficultyButtonText}>Medium</Text>
            <Text style={styles.difficultyDescription}>
              Moderate challenge
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.difficultyButton, styles.hardButton]}
            onPress={() => handleStartQuiz('hard')}
            disabled={startQuiz.isPending}
          >
            <Text style={styles.difficultyButtonText}>Hard</Text>
            <Text style={styles.difficultyDescription}>
              For experienced players
            </Text>
          </TouchableOpacity>

          {startQuiz.isPending && <ActivityIndicator size="large" style={styles.loader} />}
        </View>
      </View>
    );
  }

  // Loading state
  if (sessionLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading question...</Text>
      </View>
    );
  }

  // Quiz screen
  const currentQuestion = session?.currentQuestion;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.quizContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{session?.score || 0}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time</Text>
          <Text style={styles.timerValue}>{timeSpent}s</Text>
        </View>
      </View>

      {/* Question */}
      {currentQuestion && (
        <>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          {/* Answer Result */}
          {showResult && lastResult && (
            <View
              style={[
                styles.resultContainer,
                lastResult.isCorrect ? styles.correctResult : styles.incorrectResult,
              ]}
            >
              <Text style={styles.resultText}>
                {lastResult.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </Text>
              <Text style={styles.resultPoints}>
                +{lastResult.pointsEarned} points
                {lastResult.timeBonus > 0 && ` (+${lastResult.timeBonus} time bonus)`}
              </Text>
              {lastResult.explanation && (
                <Text style={styles.resultExplanation}>{lastResult.explanation}</Text>
              )}
            </View>
          )}

          {/* Answers */}
          <View style={styles.answersContainer}>
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswerId === answer.id;
              const isCorrect = showResult && answer.id === lastResult?.correctAnswerId;
              const isWrong =
                showResult && isSelected && !lastResult?.isCorrect;

              return (
                <TouchableOpacity
                  key={answer.id}
                  style={[
                    styles.answerButton,
                    isSelected && styles.answerButtonSelected,
                    isCorrect && styles.answerButtonCorrect,
                    isWrong && styles.answerButtonWrong,
                  ]}
                  onPress={() => !showResult && setSelectedAnswerId(answer.id)}
                  disabled={showResult || submitAnswer.isPending}
                >
                  <Text
                    style={[
                      styles.answerText,
                      isSelected && styles.answerTextSelected,
                      (isCorrect || isWrong) && styles.answerTextResult,
                    ]}
                  >
                    {answer.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submit Button */}
          {!showResult && (
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedAnswerId || submitAnswer.isPending) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitAnswer}
              disabled={!selectedAnswerId || submitAnswer.isPending}
            >
              {submitAnswer.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}

      {/* No more questions */}
      {!currentQuestion && session?.status === 'COMPLETED' && (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>Quiz Completed!</Text>
          <Text style={styles.completedScore}>Final Score: {session.score}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  difficultyButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  mediumButton: {
    backgroundColor: '#FF9800',
  },
  hardButton: {
    backgroundColor: '#F44336',
  },
  difficultyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  loader: {
    marginTop: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  quizContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  timerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
  },
  resultContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  correctResult: {
    backgroundColor: '#E8F5E9',
  },
  incorrectResult: {
    backgroundColor: '#FFEBEE',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultPoints: {
    fontSize: 16,
    marginBottom: 8,
  },
  resultExplanation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  answersContainer: {
    marginBottom: 24,
  },
  answerButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  answerButtonCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  answerButtonWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
  answerTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  answerTextResult: {
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completedContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  completedScore: {
    fontSize: 18,
    color: '#007AFF',
  },
});

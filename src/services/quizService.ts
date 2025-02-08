import { QuizAttempt, QuizPerformance } from '../types/quiz';

const QUIZ_STORAGE_KEY = 'quiz_performance';

export const saveQuizAttempt = (attempt: QuizAttempt): void => {
  const existingData = localStorage.getItem(QUIZ_STORAGE_KEY);
  const attempts = existingData ? JSON.parse(existingData) : [];
  attempts.push(attempt);
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(attempts));
};

export const getQuizPerformance = (): QuizPerformance => {
  const existingData = localStorage.getItem(QUIZ_STORAGE_KEY);
  const attempts: QuizAttempt[] = existingData ? JSON.parse(existingData) : [];

  if (attempts.length === 0) {
    return {
      attempts: [],
      averageScore: 0,
      averageTimeTaken: 0,
      totalAttempts: 0,
      bestScore: 0,
      worstScore: 0,
    };
  }

  const scores = attempts.map(a => a.score);
  const timeTakens = attempts.map(a => a.timeTaken);

  return {
    attempts,
    averageScore: scores.reduce((a, b) => a + b, 0) / attempts.length,
    averageTimeTaken: timeTakens.reduce((a, b) => a + b, 0) / attempts.length,
    totalAttempts: attempts.length,
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
  };
};

export const clearQuizHistory = (): void => {
  localStorage.removeItem(QUIZ_STORAGE_KEY);
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  timeTaken: number; // in seconds
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: {
    questionIndex: number;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface QuizPerformance {
  attempts: QuizAttempt[];
  averageScore: number;
  averageTimeTaken: number;
  totalAttempts: number;
  bestScore: number;
  worstScore: number;
}

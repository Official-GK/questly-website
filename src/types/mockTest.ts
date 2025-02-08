export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: string;
  name: string;
  description: string;
  subtopics?: string[];
}

export interface MockQuestion {
  id: string;
  topic: string;
  subtopic?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface MockTest {
  id: string;
  userId: string;
  title: string;
  description: string;
  topics: string[];
  questions: MockQuestion[];
  duration: number; // in minutes
  createdAt: number;
}

export interface TopicPerformance {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
}

export interface MockTestAttempt {
  id: string;
  userId: string;
  testId: string;
  startTime: number;
  endTime: number;
  timestamp: number;
  score: number;
  questions: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // in seconds
  }[];
  topicPerformance: TopicPerformance[];
  overallScore: number;
  totalTime: number; // in seconds
}

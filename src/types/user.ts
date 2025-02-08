export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  bio?: string;
  interests?: string;
  goals?: string;
  profileImage?: string | null;
  createdAt: string | number;
  lastActive?: number;
  isPremium?: boolean;
  role?: string;
  level?: number;
  xp?: {
    current: number;
    nextLevel: number;
  };
  stats?: {
    coursesCompleted: number;
    quizzesTaken: number;
    averageScore: number;
    streak: number;
  };
  analysis?: {
    learningStreak: number[];
    topicPerformance: {
      topic: string;
      score: number;
      total: number;
    }[];
    weeklyActivity: {
      day: string;
      hours: number;
    }[];
    strengthAreas: {
      topic: string;
      percentage: number;
    }[];
    recentScores: {
      quiz: string;
      score: number;
      date: string;
    }[];
  };
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  preferences?: {
    darkMode?: boolean;
    emailNotifications?: boolean;
  };
}

export interface UserProgress {
  userId: string;
  topics: {
    [topicId: string]: {
      totalAttempts: number;
      correctAnswers: number;
      totalQuestions: number;
      averageScore: number;
      lastAttempt: number;
    };
  };
  mockTests: {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    lastAttempt: number;
  };
  quizzes: {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    lastAttempt: number;
  };
  flashcards: {
    totalReviewed: number;
    mastered: number;
    needsReview: number;
    lastReview: number;
  };
}

export interface UserStats {
  dailyStreak: number;
  totalStudyTime: number; // in minutes
  topicsExplored: number;
  achievements: Achievement[];
  level: number;
  experience: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  icon: string;
}

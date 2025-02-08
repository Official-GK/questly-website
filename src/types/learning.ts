export interface PersonalizedFlashcard {
  term: string;
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  relevanceScore?: number;
}

export interface TopicRecommendation {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
  estimatedTimeMinutes?: number;
}

export interface UserProfile {
  id: string;
  goals: LearningGoal[];
  performance: TopicPerformance[];
  engagementMetrics: EngagementMetrics;
}

export interface LearningGoal {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
}

export interface TopicPerformance {
  topic: string;
  score: number;
  attempts: number;
  timeSpent: number;
  lastAttempt: string;
}

export interface EngagementMetrics {
  totalTimeSpent: number;
  preferredLevel: 'beginner' | 'intermediate' | 'advanced';
  completedTopics: string[];
  skippedTopics: string[];
}

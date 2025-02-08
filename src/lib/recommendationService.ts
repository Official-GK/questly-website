import type { TopicRecommendation } from '@/types/learning';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface UserContext {
  learningGoals: {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
  }[];
  topicEngagement: {
    topicId: string;
    timeSpent: number;
    lastAccessed: string;
    completionRate: number;
  }[];
  userInterests: {
    primaryInterests: string[];
    secondaryInterests: string[];
    strugglingTopics: string[];
    strongTopics: string[];
  };
  completedTopics: string[];
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
}

export async function generateTopicRecommendations(
  userContext: UserContext
): Promise<TopicRecommendation[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Based on the user's context, generate 5 personalized topic recommendations.
    User Context:
    - Current Level: ${userContext.currentLevel}
    - Primary Interests: ${userContext.userInterests.primaryInterests.join(', ')}
    - Struggling Topics: ${userContext.userInterests.strugglingTopics.join(', ')}
    - Strong Topics: ${userContext.userInterests.strongTopics.join(', ')}
    
    Return the recommendations in this exact JSON format without any markdown or code blocks:
    [{"title": "Topic Title", "description": "Topic Description", "matchScore": 85, "difficulty": "medium", "prerequisites": ["topic1", "topic2"], "estimatedTimeMinutes": 30}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Remove any markdown code block markers if present
      const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
      const recommendations = JSON.parse(cleanedText);
      
      if (!Array.isArray(recommendations) || !recommendations.every(rec => 
        typeof rec === 'object' &&
        'title' in rec &&
        'description' in rec &&
        'matchScore' in rec &&
        'difficulty' in rec &&
        'prerequisites' in rec &&
        'estimatedTimeMinutes' in rec)) {
        throw new Error('Invalid recommendation format');
      }
      
      return recommendations.map(rec => ({
        ...rec,
        matchScore: Math.min(100, Math.max(0, rec.matchScore)),
        difficulty: rec.difficulty as 'easy' | 'medium' | 'hard'
      }));
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return getDefaultRecommendations(userContext);
    }
  } catch (error) {
    console.error('Error generating topic recommendations:', error);
    return getDefaultRecommendations(userContext);
  }
}

function getDefaultRecommendations(userContext: UserContext): TopicRecommendation[] {
  const defaultTopics = [
    {
      id: '1',
      name: userContext.userInterests.primaryInterests[0] || 'Getting Started',
      description: 'Introduction to key concepts and fundamentals',
      matchScore: 90,
      difficulty: 'easy' as const,
      prerequisites: [],
      estimatedTimeMinutes: 30
    },
    {
      id: '2',
      name: 'Building Blocks',
      description: 'Essential components and patterns',
      matchScore: 85,
      difficulty: 'easy' as const,
      prerequisites: ['Getting Started'],
      estimatedTimeMinutes: 45
    },
    {
      id: '3',
      name: 'Common Challenges',
      description: 'Addressing frequent problems and solutions',
      matchScore: 80,
      difficulty: 'medium' as const,
      prerequisites: ['Building Blocks'],
      estimatedTimeMinutes: 60
    },
    {
      id: '4',
      name: 'Advanced Concepts',
      description: 'Deep dive into complex topics',
      matchScore: 75,
      difficulty: 'hard' as const,
      prerequisites: ['Common Challenges'],
      estimatedTimeMinutes: 90
    }
  ];

  return defaultTopics;
}

import type { PersonalizedFlashcard, UserProfile } from '@/types/learning';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generatePersonalizedFlashcards(
  userProfile: UserProfile,
  count: number = 3
): Promise<PersonalizedFlashcard[]> {
  try {
    // Analyze user profile to determine areas that need focus
    const weakTopics = userProfile.performance
      .filter(p => p.score < 70)
      .map(p => p.topic);
    
    const strongTopics = userProfile.performance
      .filter(p => p.score >= 70)
      .map(p => p.topic);

    // Create a prompt that takes into account user's performance
    const prompt = `You are an AI tutor creating personalized flashcards. Generate ${count} flashcards based on this student profile:

Learning Profile:
- Goals: ${userProfile.goals.map(g => `${g.topic} (${g.level})`).join(', ')}
- Areas needing improvement: ${weakTopics.join(', ') || 'None identified'}
- Strong areas: ${strongTopics.join(', ') || 'None identified'}

Generate flashcards that will help the student learn effectively. Focus more on weak topics if any are identified.

Return the response in this exact JSON format:
{
  "flashcards": [
    {
      "term": "question or concept",
      "definition": "detailed explanation or answer",
      "difficulty": "easy|medium|hard",
      "topic": "relevant subject area"
    }
  ]
}

Make sure the JSON is valid and properly formatted.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Parse the response and extract flashcards
      const parsedResponse = JSON.parse(text);
      const flashcards = parsedResponse.flashcards || [];

      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error('Invalid flashcards format');
      }

      // Validate and format the flashcards
      return flashcards.map(card => ({
        term: String(card.term || ''),
        definition: String(card.definition || ''),
        difficulty: (card.difficulty || 'medium') as 'easy' | 'medium' | 'hard',
        topic: String(card.topic || 'General'),
        relevanceScore: calculateRelevanceScore(card, userProfile)
      }));
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', text);
      
      // Fallback: Generate some basic flashcards
      return generateFallbackFlashcards(count, userProfile);
    }
  } catch (error) {
    console.error('Error generating personalized flashcards:', error);
    throw new Error('Failed to generate personalized flashcards');
  }
}

function generateFallbackFlashcards(count: number, userProfile: UserProfile): PersonalizedFlashcard[] {
  // Generate basic flashcards based on the user's goals
  const goal = userProfile.goals[0] || { topic: 'General Learning', level: 'beginner' };
  
  return Array.from({ length: count }, (_, i) => ({
    term: `${goal.topic} Concept ${i + 1}`,
    definition: `This is a basic concept in ${goal.topic}. Please try generating flashcards again for more specific content.`,
    difficulty: 'medium' as const,
    topic: goal.topic,
    relevanceScore: 50
  }));
}

function calculateRelevanceScore(
  card: PersonalizedFlashcard,
  userProfile: UserProfile
): number {
  let score = 50; // Base score

  // Adjust based on topic performance
  const topicPerformance = userProfile.performance.find(p => p.topic === card.topic);
  if (topicPerformance) {
    // Lower score for topics with high performance (we want to focus on weak areas)
    score -= (topicPerformance.score / 2);
  } else {
    // Boost score for new topics
    score += 20;
  }

  // Adjust based on user's preferred level
  const difficultyScores = {
    easy: userProfile.engagementMetrics.preferredLevel === 'beginner' ? 20 : -10,
    medium: userProfile.engagementMetrics.preferredLevel === 'intermediate' ? 20 : 0,
    hard: userProfile.engagementMetrics.preferredLevel === 'advanced' ? 20 : -10
  };
  score += difficultyScores[card.difficulty] || 0;

  // Normalize score between 0 and 100
  return Math.max(0, Math.min(100, score));
}

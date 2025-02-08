interface UserPreferences {
  interests: string[];
  experience: string;
  goals: string[];
  preferredLearningStyle: string;
  timeCommitment: string;
}

interface LearningPathStep {
  title: string;
  description: string;
  resources: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningPath {
  topic: string;
  steps: LearningPathStep[];
  totalDuration: string;
  prerequisites: string[];
}

// Store user preferences in localStorage
export const saveUserPreferences = (preferences: UserPreferences) => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

// Get user preferences from localStorage
export const getUserPreferences = (): UserPreferences | null => {
  const prefs = localStorage.getItem('userPreferences');
  return prefs ? JSON.parse(prefs) : null;
};

// Questions to ask users for learning path generation
export const learningPathQuestions = [
  {
    id: 'interests',
    question: 'What topics are you most interested in? (e.g., Web Development, AI, Mobile Apps)',
    type: 'interests'
  },
  {
    id: 'experience',
    question: 'What is your current experience level in this field?',
    type: 'experience',
    options: ['Beginner', 'Intermediate', 'Advanced']
  },
  {
    id: 'goals',
    question: 'What are your main learning goals?',
    type: 'goals'
  },
  {
    id: 'learningStyle',
    question: 'How do you prefer to learn?',
    type: 'preferredLearningStyle',
    options: ['Video Tutorials', 'Reading Documentation', 'Interactive Exercises', 'Project-Based']
  },
  {
    id: 'timeCommitment',
    question: 'How much time can you dedicate to learning per week?',
    type: 'timeCommitment',
    options: ['1-2 hours', '3-5 hours', '5-10 hours', '10+ hours']
  }
];

// Generate a learning path based on user preferences using Gemini
export const generateLearningPath = async (preferences: UserPreferences): Promise<LearningPath> => {
  const prompt = `Based on these preferences:
  - Interests: ${preferences.interests.join(', ')}
  - Experience Level: ${preferences.experience}
  - Goals: ${preferences.goals.join(', ')}
  - Learning Style: ${preferences.preferredLearningStyle}
  - Time Commitment: ${preferences.timeCommitment}

  Create a structured learning path that includes:
  1. A clear progression of topics
  2. Specific resources for each step
  3. Estimated time for completion
  4. Prerequisites
  5. Difficulty level for each step

  Format the response as a JSON object with this structure:
  {
    "topic": "Main topic",
    "steps": [
      {
        "title": "Step title",
        "description": "Step description",
        "resources": ["resource1", "resource2"],
        "estimatedTime": "X hours/weeks",
        "difficulty": "beginner/intermediate/advanced"
      }
    ],
    "totalDuration": "Total estimated time",
    "prerequisites": ["prerequisite1", "prerequisite2"]
  }`;

  // TODO: Implement Gemini API call here
  // For now, return a sample path
  return {
    topic: "Web Development",
    steps: [
      {
        title: "HTML & CSS Fundamentals",
        description: "Learn the basics of web structure and styling",
        resources: ["MDN Web Docs", "FreeCodeCamp HTML/CSS Course"],
        estimatedTime: "2 weeks",
        difficulty: "beginner"
      }
    ],
    totalDuration: "2 weeks",
    prerequisites: ["Basic computer skills"]
  };
};

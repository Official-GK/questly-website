import { GoogleGenerativeAI } from '@google/generative-ai';

// API Keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Gemini API key is not configured');
}

if (!YOUTUBE_API_KEY) {
  console.error('YouTube API key is not configured');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface FlashcardResponse {
  term: string;
  definition: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface SummaryResponse {
  mainSummary: string;
  keyPoints: string[];
  keywordAnalysis: { word: string; relevance: string }[];
  readingTime: string;
}

interface MockQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  topic: string;
  id: string;
}

// Function to extract video ID from URL
const getVideoId = (url: string): string => {
  try {
    console.log('Extracting video ID from URL:', url);
    
    // Ensure URL is properly formatted
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }

    const urlObj = new URL(url);
    let videoId = '';
    
    // Handle youtu.be format (e.g., https://youtu.be/dQw4w9WgXcQ)
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
      console.log('Extracted video ID from youtu.be format:', videoId);
    }
    // Handle youtube.com/embed format (e.g., https://www.youtube.com/embed/dQw4w9WgXcQ)
    else if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      videoId = urlObj.pathname.split('/embed/')[1];
      console.log('Extracted video ID from embed format:', videoId);
    }
    // Handle youtube.com/?v= format (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
    else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || '';
      console.log('Extracted video ID from youtube.com format:', videoId);
    }
    
    // Clean up the video ID
    videoId = videoId.split('&')[0]; // Remove any additional parameters
    videoId = videoId.split('?')[0]; // Remove any query parameters
    videoId = videoId.split('#')[0]; // Remove any hash
    
    // Validate video ID format (should be 11 characters)
    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      throw new Error('Invalid YouTube video ID. Please check your URL format.');
    }
    
    return videoId;
  } catch (error) {
    console.error('Error extracting video ID:', error);
    if (error instanceof Error) {
      if (error.message.includes('Invalid URL')) {
        throw new Error('Please enter a complete URL including https:// or http://');
      }
      throw error;
    }
    throw new Error('Failed to extract video ID from URL');
  }
};

// Function to get video details from YouTube API
const getVideoDetails = async (videoId: string) => {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_youtube_api_key_here') {
    throw new Error('YouTube API key is not configured. Please set VITE_YOUTUBE_API_KEY in your .env file.');
  }

  console.log('Attempting to fetch video details for ID:', videoId);

  try {
    // Use the correct API endpoint
    const url = new URL('https://youtube.googleapis.com/youtube/v3/videos');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', YOUTUBE_API_KEY);

    console.log('Making request to YouTube API...');
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);

    if (!response.ok) {
      if (data.error) {
        console.error('YouTube API error details:', JSON.stringify(data.error, null, 2));
        
        // Handle specific error cases
        if (data.error.code === 403) {
          if (data.error.message.includes('quota')) {
            throw new Error('YouTube API quota exceeded. Please try again later.');
          }
          throw new Error('YouTube API key is not authorized. Please check API key configuration.');
        }
        
        if (data.error.code === 400) {
          if (data.error.message.includes('API key not valid')) {
            throw new Error('Invalid YouTube API key. Please check your API key configuration in the .env file.');
          }
          throw new Error('Invalid request to YouTube API. Please check the video URL.');
        }

        throw new Error(`YouTube API error: ${data.error.message || 'Unknown error'}`);
      }
      throw new Error(`Failed to fetch video details. Status: ${response.status}`);
    }
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found on YouTube. Please check the URL and try again.');
    }
    
    console.log('Successfully fetched video details');
    return {
      title: data.items[0].snippet.title,
      description: data.items[0].snippet.description,
      channelTitle: data.items[0].snippet.channelTitle,
    };
  } catch (error) {
    console.error('Full error details:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch video details. Please check your YouTube URL and try again.');
  }
};

// Function to generate flashcards from text
export const generateFlashcards = async (topic: string): Promise<FlashcardResponse[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your environment variables.');
  }

  try {
    const prompt = `Create educational flashcards for studying "${topic}". 
    Create exactly 5 flashcards that test understanding of key concepts.
    Return ONLY a JSON array without any markdown formatting or explanation. Each flashcard must have:
    - 'term': a clear question or concept
    - 'definition': a complete and accurate explanation
    
    Example format:
    [{"term": "What is photosynthesis?", "definition": "The process by which plants convert sunlight into chemical energy"}]
    
    Important: Return ONLY the JSON array, no other text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Remove any markdown code block formatting if present
      const jsonStr = text.replace(/^```json\n|\n```$/g, '').trim();
      const flashcards = JSON.parse(jsonStr);
      
      if (!Array.isArray(flashcards)) {
        throw new Error('Invalid response format');
      }
      
      // Validate the structure of each flashcard
      const validFlashcards = flashcards.every(card => 
        typeof card === 'object' && 
        card !== null && 
        typeof card.term === 'string' && 
        typeof card.definition === 'string'
      );
      
      if (!validFlashcards) {
        throw new Error('Invalid flashcard format');
      }
      
      return flashcards;
    } catch (error) {
      console.error('Error parsing flashcards:', error);
      throw new Error('Failed to generate valid flashcards. Please try again.');
    }
  } catch (error) {
  console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards. Please try again.');
  }
};

// Function to generate flashcards from YouTube video
export const generateFlashcardsFromYouTube = async (url: string): Promise<FlashcardResponse[]> => {
  try {
    const videoId = getVideoId(url);
    const videoDetails = await getVideoDetails(videoId);
    
    const prompt = `Create educational flashcards based on this YouTube video:
    Title: ${videoDetails.title}
    Channel: ${videoDetails.channelTitle}
    Description: ${videoDetails.description}

    Create 5 flashcards that test understanding of the key concepts from this video.
    Format the response as a valid JSON array with exactly this format, no markdown or code blocks:
    [{"term": "question here", "definition": "answer here"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Remove any markdown code block markers if present
      const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
      const flashcards = JSON.parse(cleanedText);
      
      if (!Array.isArray(flashcards) || !flashcards.every(card => 
        typeof card === 'object' && 
        'term' in card && 
        'definition' in card)) {
        throw new Error('Invalid response format');
      }
      
      return flashcards;
    } catch (error) {
      console.error('Error parsing flashcards:', error);
      throw new Error('Failed to generate valid flashcards. Please try again.');
    }
  } catch (error) {
    console.error('Error generating flashcards from YouTube:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate flashcards. Please try again.');
  }
};

// Function to generate quiz from YouTube video
export const generateQuizFromYouTube = async (url: string): Promise<QuizQuestion[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const videoId = getVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const videoDetails = await getVideoDetails(videoId);
    const prompt = `Create 5 multiple choice questions based on this video: "${videoDetails.title}"
    
Instructions:
1. Each question must have EXACTLY 4 options
2. IMPORTANT: The correctAnswer must be the FULL TEXT of one of the options, not just A, B, C, or D
3. Include a brief explanation for each answer
4. Format each question like this:
{
  "question": "What is Python?",
  "options": [
    "A programming language",
    "A type of snake",
    "A mathematical concept",
    "A database system"
  ],
  "correctAnswer": "A programming language",
  "explanation": "Python is a high-level programming language..."
}

Return exactly 5 questions in a JSON array.
Do not use any special characters or line breaks in the text fields.
Make sure all quotes are properly escaped.
Remember: correctAnswer must be the EXACT FULL TEXT of the correct option.`;

    const result = await model.generateContent(prompt);
    if (!result.response) {
      throw new Error('Failed to generate quiz content');
    }

    const text = result.response.text();
    console.log('Raw response:', text);
    
    try {
      // Function to safely parse JSON with custom cleanup
      const safeJSONParse = (text: string): any => {
        // First pass: Basic cleanup
        let cleanText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        try {
          return JSON.parse(cleanText);
        } catch (e) {
          // Second pass: More aggressive cleanup
          cleanText = cleanText
            // Remove all whitespace between array/object brackets
            .replace(/\[\s+/g, '[')
            .replace(/\s+\]/g, ']')
            .replace(/{\s+/g, '{')
            .replace(/\s+}/g, '}')
            // Normalize quotes
            .replace(/[""]/g, '"')
            // Remove any BOM or hidden characters
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            // Ensure proper spacing around colons
            .replace(/"\s*:\s*/g, '":')
            // Fix common JSON syntax issues
            .replace(/,\s*([\]}])/g, '$1')
            .replace(/\n/g, ' ');

          try {
            return JSON.parse(cleanText);
          } catch (e) {
            // Third pass: Try to extract valid JSON
            const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              return JSON.parse(jsonMatch[0]);
            }
            throw e;
          }
        }
      };

      // Parse and validate the response
      const questions = safeJSONParse(text);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      // Normalize and validate each question
      return questions.map((q, index) => {
        // Basic validation
        if (!q?.question || !Array.isArray(q?.options) || !q?.correctAnswer || !q?.explanation) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }

        // Clean and normalize the question data
        const normalizedQuestion = {
          question: String(q.question).trim(),
          options: q.options.map((opt: any) => String(opt).trim()),
          correctAnswer: String(q.correctAnswer).trim(),
          explanation: String(q.explanation).trim()
        };

        // Ensure exactly 4 options
        if (normalizedQuestion.options.length !== 4) {
          throw new Error(`Question ${index + 1} must have exactly 4 options`);
        }

        // Check for duplicate options
        const uniqueOptions = new Set(normalizedQuestion.options);
        if (uniqueOptions.size !== 4) {
          throw new Error(`Question ${index + 1} has duplicate options`);
        }

        // Try to match the correct answer
        const exactMatch = normalizedQuestion.options.includes(normalizedQuestion.correctAnswer);
        
        // If no exact match, try to find by letter (A, B, C, D)
        if (!exactMatch && /^[A-D]$/.test(normalizedQuestion.correctAnswer)) {
          const index = normalizedQuestion.correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0);
          if (index >= 0 && index < normalizedQuestion.options.length) {
            normalizedQuestion.correctAnswer = normalizedQuestion.options[index];
          }
        }

        // Final check for correct answer
        if (!normalizedQuestion.options.includes(normalizedQuestion.correctAnswer)) {
          console.error(`Question ${index + 1} validation failed:`, {
            options: normalizedQuestion.options,
            correctAnswer: normalizedQuestion.correctAnswer
          });
          throw new Error(`Question ${index + 1}'s correct answer does not match any option exactly`);
        }

        return normalizedQuestion;
      });
    } catch (error) {
      console.error('Error parsing quiz questions:', error);
      console.error('Raw response:', text);
      throw new Error('Failed to parse quiz response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating quiz from YouTube:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate quiz. Please try again.');
  }
};

// Function to generate summary
export const generateSummary = async (text: string): Promise<string> => {
  if (!text) {
    throw new Error('No text provided for summarization');
  }

  try {
    const prompt = `Summarize the following text in a clear and concise way: ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
};

// Function to generate mock test questions
export const generateQuestions = async (
  topics: string[],
  distribution: { easy: number; medium: number; hard: number }
): Promise<MockQuestion[]> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your environment variables.');
  }

  const totalQuestions = distribution.easy + distribution.medium + distribution.hard;
  const questionsPerTopic = Math.ceil(totalQuestions / topics.length);

  try {
    const prompt = `Generate a mock test with EXACTLY ${totalQuestions} multiple-choice questions.

STRICT REQUIREMENTS:
1. EXACT Difficulty Distribution (most important):
   - Easy: ${distribution.easy} questions
   - Medium: ${distribution.medium} questions
   - Hard: ${distribution.hard} questions

2. Topics Distribution:
   Topics: ${topics.map(t => `"${t}"`).join(', ')}
   - Each topic should have ${questionsPerTopic} questions (±1)
   - Ensure even distribution across topics

3. Question Format:
   {
     "question": "Clear question text",
     "options": ["Option A", "Option B", "Option C", "Option D"],
     "correctAnswer": "Must match one option exactly",
     "explanation": "Brief explanation",
     "difficulty": "easy|medium|hard",
     "topic": "Must match topic exactly"
   }

CRITICAL VALIDATION RULES:
1. MUST have exactly:
   - ${distribution.easy} easy questions
   - ${distribution.medium} medium questions
   - ${distribution.hard} hard questions
2. Topic names must match exactly (case-sensitive)
3. Each topic must have ${questionsPerTopic} questions (±1)
4. Correct answer must match one option exactly
5. All options must be unique and plausible

Return ONLY a JSON array. No other text or formatting.

Example format:
[
  {
    "question": "What is React's virtual DOM?",
    "options": [
      "A lightweight copy of the actual DOM",
      "A browser extension for React",
      "A CSS framework",
      "A JavaScript library"
    ],
    "correctAnswer": "A lightweight copy of the actual DOM",
    "explanation": "Virtual DOM is React's lightweight representation of the actual DOM",
    "difficulty": "medium",
    "topic": "${topics[0]}"
  }
]`;

    // First attempt
    let questions = await generateQuestionsWithRetry(prompt, topics, distribution);
    
    // If first attempt fails, try with simpler distribution
    if (!questions) {
      const simplifiedPrompt = `${prompt}\n\nIMPORTANT: Focus on EXACT difficulty counts first:\n- ${distribution.easy} easy\n- ${distribution.medium} medium\n- ${distribution.hard} hard`;
      questions = await generateQuestionsWithRetry(simplifiedPrompt, topics, distribution);
      
      if (!questions) {
        throw new Error('Failed to generate questions with correct distribution after multiple attempts');
      }
    }

    // Add unique IDs
    return questions.map(q => ({
      ...q,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));

  } catch (error) {
    console.error('Error generating questions:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate questions. Please try again.');
  }
};

// Helper function to generate questions with retry logic
async function generateQuestionsWithRetry(
  prompt: string,
  topics: string[],
  distribution: { easy: number; medium: number; hard: number },
  maxRetries = 3
): Promise<MockQuestion[] | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean up response
      if (text.startsWith('```')) {
        text = text.replace(/^```json?\s*/, '').replace(/\s*```$/, '');
      }
      
      const questions: MockQuestion[] = JSON.parse(text);
      
      // Validate questions
      if (!validateQuestions(questions, topics, distribution)) {
        if (attempt === maxRetries) {
          return null;
        }
        continue;
      }
      
      return questions;
    } catch (error) {
      if (attempt === maxRetries) {
        return null;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
}

// Helper function to validate questions
function validateQuestions(
  questions: MockQuestion[],
  topics: string[],
  distribution: { easy: number; medium: number; hard: number }
): boolean {
  // Count questions by difficulty and topic
  const difficultyCount = {
    easy: 0,
    medium: 0,
    hard: 0
  };
  const topicCount = new Map<string, number>();
  topics.forEach(topic => topicCount.set(topic, 0));

  // Validate each question
  for (const q of questions) {
    // Basic validation
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
        !q.correctAnswer || !q.options.includes(q.correctAnswer) ||
        !['easy', 'medium', 'hard'].includes(q.difficulty) ||
        !topics.includes(q.topic)) {
      return false;
    }

    // Count difficulties and topics
    difficultyCount[q.difficulty as keyof typeof difficultyCount]++;
    topicCount.set(q.topic, (topicCount.get(q.topic) || 0) + 1);
  }

  // Validate difficulty distribution
  if (difficultyCount.easy !== distribution.easy ||
      difficultyCount.medium !== distribution.medium ||
      difficultyCount.hard !== distribution.hard) {
    return false;
  }

  // Validate topic distribution
  const totalQuestions = questions.length;
  const minQuestionsPerTopic = Math.floor(totalQuestions / topics.length);
  const maxQuestionsPerTopic = Math.ceil(totalQuestions / topics.length);

  for (const count of topicCount.values()) {
    if (count < minQuestionsPerTopic || count > maxQuestionsPerTopic) {
      return false;
    }
  }

  return true;
}

export type { FlashcardResponse, QuizQuestion, SummaryResponse, MockQuestion };

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Bot, Brain, Youtube, Plus, Minus, ArrowRight, Sparkles, TrendingUp, BookOpen, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateFlashcards, generateFlashcardsFromYouTube } from '@/lib/gemini';
import { generatePersonalizedFlashcards } from '@/lib/personalizedLearning';
import { generateTopicRecommendations } from '@/lib/recommendationService';
import type { PersonalizedFlashcard, TopicRecommendation, UserProfile } from '@/types/learning';

// Mock user profile for demonstration
const mockUserProfile: UserProfile = {
  id: '1',
  goals: [
    {
      topic: 'Programming',
      level: 'intermediate',
      description: 'Learn Python programming fundamentals and intermediate concepts'
    }
  ],
  performance: [
    {
      topic: 'Variables',
      score: 90,
      attempts: 3,
      timeSpent: 1200,
      lastAttempt: '2024-01-10T10:00:00Z'
    },
    {
      topic: 'Loops',
      score: 60,
      attempts: 2,
      timeSpent: 1800,
      lastAttempt: '2024-01-09T15:00:00Z'
    },
    {
      topic: 'Functions',
      score: 50,
      attempts: 1,
      timeSpent: 900,
      lastAttempt: '2024-01-08T14:00:00Z'
    }
  ],
  engagementMetrics: {
    totalTimeSpent: 3900,
    preferredLevel: 'beginner',
    completedTopics: ['Variables'],
    skippedTopics: ['Classes']
  }
} as const;

interface FlashcardType {
  term: string;
  definition: string;
}

const FlashCard = ({ 
  card, 
  isFlipped, 
  onFlip, 
  isPersonalized = false 
}: { 
  card: FlashcardType | PersonalizedFlashcard, 
  isFlipped: boolean, 
  onFlip: () => void,
  isPersonalized?: boolean 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="flashcard-container" onClick={onFlip}>
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face card-front">
          <div className="card-content">
            <h3 className="card-title">Question</h3>
            <p className="card-text">{card.term}</p>
            {isPersonalized && 'difficulty' in card && (
              <span className={`mt-4 ${getDifficultyColor(card.difficulty)}`}>
                Difficulty: {card.difficulty}
              </span>
            )}
          </div>
        </div>
        <div className="card-face card-back">
          <div className="card-content">
            <h3 className="card-title">Answer</h3>
            <p className="card-text">{card.definition}</p>
            {isPersonalized && 'topic' in card && (
              <p className="mt-4 text-white/60">
                Topic: {card.topic}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Flashcards = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [flashcards, setFlashcards] = useState<(FlashcardType | PersonalizedFlashcard)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPersonalizedMode, setIsPersonalizedMode] = useState(false);
  const [cardCount, setCardCount] = useState(3);
  const [recommendations, setRecommendations] = useState<TopicRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isYouTubeMode, setIsYouTubeMode] = useState(false);
  const [numCards, setNumCards] = useState(3);
  const { toast } = useToast();

  // Load recommendations when entering personalized mode
  useEffect(() => {
    if (isPersonalizedMode) {
      loadRecommendations();
    }
  }, [isPersonalizedMode]);

  const loadRecommendations = async () => {
    try {
      // Using mock user context for now
      const mockUserContext = {
        learningGoals: [
          {
            id: '1',
            title: topic || 'Learning',
            description: `Master ${topic || 'the subject'}`,
            priority: 'high' as const,
            status: 'in_progress' as const
          }
        ],
        topicEngagement: [],
        userInterests: {
          primaryInterests: topic ? [topic] : [],
          secondaryInterests: [],
          strugglingTopics: [],
          strongTopics: []
        },
        completedTopics: [],
        currentLevel: 'beginner' as const
      };

      const newRecommendations = await generateTopicRecommendations(mockUserContext);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!inputText.trim() && !isPersonalizedMode) {
        toast({
          title: "Error",
          description: "Please enter some text to generate flashcards.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      let response;
      if (isPersonalizedMode) {
        response = await generatePersonalizedFlashcards(mockUserProfile, numCards);
      } else if (isYouTubeMode) {
        if (!inputText.includes('youtube.com') && !inputText.includes('youtu.be')) {
          throw new Error('Please enter a valid YouTube URL');
        }
        response = await generateFlashcardsFromYouTube(inputText);
        response = response.slice(0, numCards);
      } else {
        response = await generateFlashcards(inputText);
        response = response.slice(0, numCards);
      }
      setFlashcards(response);
      if (!isPersonalizedMode) {
        setInputText('');
      }
      setCurrentIndex(0);
      setIsFlipped(false);
      toast({
        title: "Success!",
        description: "Flashcards generated successfully.",
      });
    } catch (err) {
      console.error('Error generating flashcards:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to generate flashcards. Please try again.',
        variant: "destructive",
      });
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const previousCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const incrementCards = () => {
    if (numCards < 5) {
      setNumCards(numCards + 1);
    }
  };

  const decrementCards = () => {
    if (numCards > 1) {
      setNumCards(numCards - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Flashcards
          </h1>
          <p className="text-lg text-white/60 mb-8">
            Generate and study flashcards using AI
          </p>
        </div>

        {/* Mode toggles */}
        <div className="mode-toggles">
          <button
            className={`mode-toggle ${!isPersonalizedMode && !isYouTubeMode ? 'active' : ''}`}
            onClick={() => {
              setIsPersonalizedMode(false);
              setIsYouTubeMode(false);
            }}
          >
            <Brain className="w-5 h-5" />
            Text Mode
          </button>
          <button
            className={`mode-toggle ${isYouTubeMode ? 'active' : ''}`}
            onClick={() => {
              setIsYouTubeMode(true);
              setIsPersonalizedMode(false);
            }}
          >
            <Youtube className="w-5 h-5" />
            YouTube Mode
          </button>
          <button
            className={`mode-toggle ${isPersonalizedMode ? 'active' : ''}`}
            onClick={() => {
              setIsPersonalizedMode(true);
              setIsYouTubeMode(false);
            }}
          >
            <Sparkles className="w-5 h-5" />
            Personalized Mode
          </button>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="input-container mb-8">
          {!isPersonalizedMode && (
            <div className="space-y-4">
              <Label htmlFor="input">
                {isYouTubeMode ? 'YouTube Video URL' : 'Enter text to generate flashcards'}
              </Label>
              <Input
                id="input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isYouTubeMode
                    ? 'Paste YouTube URL here...'
                    : 'Enter text or paste content here...'
                }
                className="input-field"
              />
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <Label>Number of cards:</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setNumCards(Math.max(1, numCards - 1))}
                disabled={numCards <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">{numCards}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setNumCards(Math.min(10, numCards + 1))}
                disabled={numCards >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={loading || (!inputText && !isPersonalizedMode)}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Generate Flashcards
              </span>
            )}
          </Button>
        </form>

        {/* Flashcard display */}
        {flashcards.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <FlashCard
                  key={`card-${currentIndex}`}
                  card={flashcards[currentIndex]}
                  isFlipped={isFlipped}
                  onFlip={toggleFlip}
                  isPersonalized={isPersonalizedMode}
                />
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={previousCard}
                disabled={currentIndex === 0}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={nextCard}
                disabled={currentIndex === flashcards.length - 1}
                variant="outline"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Topic recommendations */}
        {isPersonalizedMode && recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recommended Topics
            </h2>
            <div className="recommendations">
              {recommendations.map((rec, index) => (
                <div
                  key={`${rec.topic}-${index}`}
                  className="recommendation-card"
                  onClick={() => {
                    setTopic(rec.topic);
                    handleSubmit(new Event('submit') as any);
                  }}
                >
                  <h3 className="font-semibold mb-2">{rec.topic}</h3>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;

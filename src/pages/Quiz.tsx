import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { QuizQuestion, QuizAttempt } from '@/types/quiz';
import { useAuth } from '@/contexts/AuthContext';
import { updateQuizProgress } from '@/services/userService';
import { Timer, AlertTriangle } from 'lucide-react';
import { generateQuizFromYouTube } from '@/lib/gemini';
import { useNavigate } from 'react-router-dom';
import { saveQuizAttempt } from '@/services/quizService';
import { Bot, Youtube, CheckCircle2, XCircle } from 'lucide-react';
import { QuizResults } from '@/components/quiz/QuizResults';

const Quiz = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const { toast } = useToast();

  // Load stored quiz on component mount
  useEffect(() => {
    const storedQuiz = localStorage.getItem('youtubeQuiz');
    if (storedQuiz) {
      try {
        const parsedQuiz = JSON.parse(storedQuiz);
        if (Array.isArray(parsedQuiz) && parsedQuiz.length > 0) {
          setQuestions(parsedQuiz);
          setStartTime(Date.now());
          localStorage.removeItem('youtubeQuiz');
          return;
        }
      } catch (error) {
        console.error('Error parsing stored quiz:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate quizzes.",
        variant: "destructive"
      });
      return;
    }

    const cleanUrl = url.trim();
    if (!cleanUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const generatedQuestions = await generateQuizFromYouTube(cleanUrl);
      setQuestions(generatedQuestions);
      setStartTime(Date.now());
      setLoading(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      const endTime = Date.now();
      const totalTime = Math.floor((endTime - (startTime || endTime)) / 1000);
      
      const attempt: QuizAttempt = {
        id: `${currentUser?.uid}-${Date.now()}`,
        userId: currentUser?.uid || '',
        timestamp: new Date().toISOString(),
        timeTaken: totalTime,
        score: score + (isCorrect ? 1 : 0),
        totalQuestions: questions.length,
        correctAnswers: score + (isCorrect ? 1 : 0),
        answers: questions.map((q, i) => ({
          questionIndex: i,
          question: q,
          userAnswer: i === currentQuestion ? selectedAnswer : '',
          isCorrect: i === currentQuestion ? isCorrect : false
        }))
      };

      try {
        await saveQuizAttempt(attempt);
        setCurrentAttempt(attempt);
        setShowResult(true);
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        toast({
          title: "Error",
          description: "Failed to save quiz results",
          variant: "destructive"
        });
      }
    }
  };

  // Show results if quiz complete
  if (showResult && currentAttempt) {
    return (
      <div className="container py-8 space-y-8">
        <QuizResults
          questions={questions}
          score={score}
          totalTime={startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}
          attempt={currentAttempt}
          onTryAgain={() => {
            setQuestions([]);
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setScore(0);
            setShowResult(false);
            setStartTime(null);
            setCurrentAttempt(null);
          }}
        />
      </div>
    );
  }

  // Show quiz interface
  return (
    <div className="container py-8 space-y-8">
      {!questions.length ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">AI Video Quiz</h1>
            <p className="text-[#B3B3B3]">Test your knowledge from the video content</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Paste YouTube URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pr-32 bg-[#1E1E1E] border-[#333333] text-white placeholder-[#666666]"
                />
                <Button
                  type="submit"
                  disabled={loading || !url}
                  className="absolute right-0 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Generate Quiz
                </Button>
              </div>
              <div className="absolute inset-0 rounded-lg transition-opacity duration-500" 
                style={{ 
                  boxShadow: "0 0 15px rgba(16,185,129,0.1)",
                  pointerEvents: "none",
                  opacity: loading ? 1 : 0
                }} 
              />
            </div>

            {loading && (
              <div className="flex items-center justify-center p-8">
                <Bot className="w-8 h-8 text-emerald-500 animate-bounce" />
                <p className="ml-3 text-[#B3B3B3]">Generating quiz questions...</p>
              </div>
            )}
          </form>

          {/* Recent Attempts Section */}
          {userProfile?.recentQuizAttempts && userProfile.recentQuizAttempts.length > 0 && (
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-semibold text-white">Recent Attempts</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userProfile.recentQuizAttempts.map((attempt, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-[#1E1E1E] border border-[#333333] hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="font-medium text-white truncate">
                          {attempt.videoTitle || "YouTube Video Quiz"}
                        </h3>
                        <p className="text-sm text-[#B3B3B3]">
                          Score: {attempt.score}/{attempt.totalQuestions}
                        </p>
                      </div>
                      {attempt.score / attempt.totalQuestions >= 0.7 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Progress
                        value={(attempt.score / attempt.totalQuestions) * 100}
                        className="h-2"
                        indicatorClassName={
                          attempt.score / attempt.totalQuestions >= 0.7
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }
                      />
                      <div className="flex justify-between text-xs text-[#B3B3B3]">
                        <span>Completed {new Date(attempt.completedAt).toLocaleDateString()}</span>
                        <span>{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Question {currentQuestion + 1} of {questions.length}</h2>
              <div className="flex items-center text-[#B3B3B3]">
                <Timer className="w-4 h-4 mr-2" />
                <span>{startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s</span>
              </div>
            </div>
            <Progress 
              value={((currentQuestion + 1) / questions.length) * 100} 
              className="h-2"
              indicatorClassName="bg-emerald-500"
            />
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-[#1E1E1E] border-[#333333]">
              <h3 className="text-xl font-medium text-white mb-4">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      selectedAnswer === option
                        ? "border-emerald-500 bg-emerald-500/10 text-white"
                        : "border-[#333333] hover:border-emerald-500/50 text-[#B3B3B3] hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;

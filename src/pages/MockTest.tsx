import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Timer, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MockTestGenerator } from '@/components/mock-test/MockTestGenerator';
import { QuizResults } from '@/components/quiz/QuizResults';
import { MockTest, MockTestAttempt } from '@/types/mockTest';
import { calculateTopicPerformance, saveMockTestAttempt, generateMockTest } from '@/services/mockTestService';
import { useAuth } from '@/contexts/AuthContext';

export default function MockTest() {
  const [currentTest, setCurrentTest] = useState<MockTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [testComplete, setTestComplete] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<MockTestAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser, userProfile } = useAuth();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCurrentTest(null);
      setCurrentAttempt(null);
      setTestComplete(false);
      setAnswers([]);
      setSelectedAnswer(null);
      setStartTime(null);
      setRemainingTime(null);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentTest && startTime && remainingTime !== null) {
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, (currentTest.duration * 60) - elapsed);
        
        setRemainingTime(remaining);

        if (remaining === 0 && !testComplete) {
          handleTestComplete();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentTest, startTime, remainingTime, testComplete]);

  const handleTestGeneration = async (topics: string[], duration: number) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to take a mock test.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const test = await generateMockTest(topics, duration, currentUser.uid);
      setCurrentTest(test);
      setStartTime(Date.now());
      setRemainingTime(test.duration * 60);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers([]);
      setTestComplete(false);
      setCurrentAttempt(null);

      toast({
        title: "Test Started",
        description: `You have ${test.duration} minutes to complete ${test.questions.length} questions.`,
      });
    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: "Error",
        description: "Failed to generate test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestStart = (test: MockTest) => {
    // Reset all state
    setCurrentTest(test);
    setStartTime(Date.now());
    setRemainingTime(test.duration * 60);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setTestComplete(false);
    setCurrentAttempt(null);

    // Show start message
    toast({
      title: "Test Started",
      description: `You have ${test.duration} minutes to complete ${test.questions.length} questions.`,
    });
  };

  const handleAnswerSelect = (answer: string) => {
    if (!selectedAnswer) {
      setSelectedAnswer(answer);
      // Show feedback
      toast({
        title: "Answer Selected",
        description: "Click 'Next Question' to continue.",
      });
    }
  };

  const handleNextQuestion = () => {
    if (!currentTest || selectedAnswer === null) return;

    const now = Date.now();
    const questionStartTime = startTime! + answers.reduce((acc, curr) => acc + curr.timeSpent * 1000, 0);
    const timeSpent = Math.floor((now - questionStartTime) / 1000);

    const newAnswer = {
      questionId: currentTest.questions[currentQuestion].id,
      userAnswer: selectedAnswer,
      isCorrect: selectedAnswer === currentTest.questions[currentQuestion].correctAnswer,
      timeSpent
    };

    setAnswers(prev => [...prev, newAnswer]);

    if (currentQuestion < currentTest.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleTestComplete();
    }
  };

  const handleTestComplete = async () => {
    if (!currentTest || !startTime || !currentUser) return;

    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);

    // Ensure we have all answers before calculating performance
    const answeredQuestions = currentTest.questions.map((question, index) => {
      const answer = answers[index];
      if (!answer) {
        return {
          questionId: question.id,
          userAnswer: '',
          isCorrect: false,
          timeSpent: 0
        };
      }
      return answer;
    });

    const score = (answeredQuestions.filter(a => a.isCorrect).length / currentTest.questions.length) * 100;

    const attempt: MockTestAttempt = {
      id: '',  // Will be set by Firestore
      userId: currentUser.uid,
      testId: currentTest.id,
      startTime,
      endTime,
      timestamp: Date.now(),
      score,
      questions: answeredQuestions,
      topicPerformance: calculateTopicPerformance(currentTest.questions, answeredQuestions),
      overallScore: score,
      totalTime
    };

    try {
      await saveMockTestAttempt(attempt);
      setCurrentAttempt(attempt);
      setTestComplete(true);

      // Show completion message
      toast({
        title: "Test Completed!",
        description: `Your score: ${Math.round(score)}%`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save test results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show test generator if no test or test complete without attempt
  if (!currentTest) {
    return (
      <div className="container mx-auto py-6">
        <MockTestGenerator onTestGenerated={handleTestGeneration} isLoading={isLoading} />
      </div>
    );
  }

  // Show results if test complete with attempt
  if (currentAttempt) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <QuizResults
          attempt={{
            id: currentAttempt.id,
            timestamp: currentAttempt.startTime,
            timeTaken: currentAttempt.totalTime,
            score: currentAttempt.overallScore,
            totalQuestions: currentTest.questions.length,
            correctAnswers: currentAttempt.questions.filter(a => a.isCorrect).length,
            answers: currentAttempt.questions.map((a, i) => ({
              questionIndex: i,
              userAnswer: a.userAnswer,
              isCorrect: a.isCorrect,
              question: currentTest.questions[i]
            })),
            topicPerformance: currentAttempt.topicPerformance
          }}
          onRetry={() => {
            setCurrentTest(null);
            setCurrentAttempt(null);
          }}
        />
      </div>
    );
  }

  // Show current question
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Timer and Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Timer className="w-5 h-5" />
          <span className="text-lg font-semibold">{formatTime(remainingTime)}</span>
        </div>
        <Progress value={(currentQuestion / currentTest.questions.length) * 100} />
        <span className="text-sm">
          Question {currentQuestion + 1} of {currentTest.questions.length}
        </span>
      </div>

      {/* Question Card */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">
          {currentTest.questions[currentQuestion].question}
        </h3>

        <div className="space-y-4">
          {currentTest.questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className="w-full justify-start text-left"
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null && selectedAnswer !== option}
            >
              {option}
            </Button>
          ))}
        </div>

        {selectedAnswer && (
          <Button
            className="w-full"
            onClick={handleNextQuestion}
          >
            {currentQuestion < currentTest.questions.length - 1 ? "Next Question" : "Finish Test"}
          </Button>
        )}
      </Card>

      {/* Time Warning */}
      {remainingTime !== null && remainingTime < 300 && (
        <div className="flex items-center space-x-2 text-yellow-500">
          <AlertTriangle className="w-5 h-5" />
          <span>Less than 5 minutes remaining!</span>
        </div>
      )}
    </div>
  );
}

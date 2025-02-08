import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Trophy, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  chapterTitle: string;
  onComplete: () => void;
}

// Generate questions based on chapter title
const generateQuestions = (title: string) => {
  const questions = [
    {
      question: `What is the main focus of ${title}?`,
      options: [
        `Understanding ${title} fundamentals`,
        `Advanced ${title} concepts`,
        `${title} in practice`,
        `${title} architecture`
      ],
      correctAnswer: 0,
      xp: 50
    },
    {
      question: `Which of the following is NOT typically associated with ${title}?`,
      options: [
        "Data Structures",
        "Machine Learning",
        "Web Development",
        "Game Design"
      ],
      correctAnswer: 3,
      xp: 50
    },
    {
      question: `What is a common use case for ${title}?`,
      options: [
        "Building web applications",
        "Data analysis",
        "System automation",
        "All of the above"
      ],
      correctAnswer: 3,
      xp: 75
    },
    {
      question: `Which tool is most commonly used with ${title}?`,
      options: [
        "Visual Studio Code",
        "Command Line Interface",
        "Web Browser",
        "Database Management System"
      ],
      correctAnswer: 0,
      xp: 50
    },
    {
      question: `What is the best practice when working with ${title}?`,
      options: [
        "Writing documentation",
        "Testing code",
        "Version control",
        "All of the above"
      ],
      correctAnswer: 3,
      xp: 75
    },
    {
      question: `How does ${title} handle error management?`,
      options: [
        "Try-catch blocks",
        "Error logging",
        "Error callbacks",
        "All of the above"
      ],
      correctAnswer: 3,
      xp: 50
    },
    {
      question: `What is the primary advantage of using ${title}?`,
      options: [
        "Performance",
        "Scalability",
        "Ease of use",
        "Security"
      ],
      correctAnswer: 1,
      xp: 75
    },
    {
      question: `Which pattern is commonly used in ${title}?`,
      options: [
        "MVC Pattern",
        "Observer Pattern",
        "Factory Pattern",
        "Singleton Pattern"
      ],
      correctAnswer: 0,
      xp: 50
    },
    {
      question: `What type of applications can be built with ${title}?`,
      options: [
        "Web Applications",
        "Mobile Apps",
        "Desktop Software",
        "All of the above"
      ],
      correctAnswer: 3,
      xp: 75
    },
    {
      question: `What is the future trend for ${title}?`,
      options: [
        "Cloud Integration",
        "AI Integration",
        "IoT Integration",
        "All of the above"
      ],
      correctAnswer: 3,
      xp: 100
    }
  ];
  return questions;
};

export default function VideoPlayer({
  videoUrl,
  title,
  chapterTitle,
  onComplete
}: VideoPlayerProps) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  const [questions] = useState(() => generateQuestions(chapterTitle));
  const [showResult, setShowResult] = useState(false);

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            setIsPlaying(false);
            setIsVideoComplete(true);
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const handleAnswerSubmit = (selectedAnswer: number) => {
    const currentQ = questions[currentQuestion];
    if (currentQ.correctAnswer === selectedAnswer) {
      setScore(score + 1);
      setTotalXP(totalXP + currentQ.xp);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <h2 className="text-xl text-muted-foreground">{chapterTitle}</h2>
        </div>

        {!showQuiz ? (
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
              
              {!isPlaying && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-12 w-12" />
                </Button>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <Progress value={progress} className="mb-4" />
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white/20"
                      onClick={() => setProgress(Math.max(0, progress - 10))}
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white/20"
                      onClick={() => setProgress(Math.min(100, progress + 10))}
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                    <div className="text-sm">
                      {Math.floor(progress)}% Complete
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            {!showResult ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Chapter Quiz</h3>
                      <p className="text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold">{totalXP} XP</span>
                    </div>
                  </div>
                  <Progress 
                    value={(currentQuestion / questions.length) * 100} 
                    className="mt-4"
                  />
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-lg font-medium">
                      {questions[currentQuestion].question}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        {questions[currentQuestion].xp} XP
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left p-4"
                        onClick={() => handleAnswerSubmit(index)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-xl mb-4">
                  You scored {score} out of {questions.length}
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold">{totalXP} XP</span>
                </div>
                <Alert className="mb-6">
                  <AlertDescription>
                    Great job! You've earned {totalXP} XP from this chapter.
                  </AlertDescription>
                </Alert>
                <Button 
                  size="lg" 
                  onClick={() => {
                    onComplete();
                    navigate(-1);
                  }}
                >
                  Continue Learning
                </Button>
              </div>
            )}
          </Card>
        )}

        {isVideoComplete && !showQuiz && (
          <div className="mt-6">
            <Alert className="mb-4">
              <AlertDescription>
                You've completed the video! Take the quiz to earn up to 650 XP.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button 
                size="lg"
                onClick={() => setShowQuiz(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Take Chapter Quiz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

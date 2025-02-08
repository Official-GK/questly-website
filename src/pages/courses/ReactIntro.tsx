import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayCircle, CheckCircle, Heart, Share2, BookmarkPlus, Star, Code, Lock, Play, PauseCircle } from "lucide-react";

interface Video {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  completed: boolean;
  locked: boolean;
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

const ReactIntro = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const videos: Video[] = [
    {
      id: 1,
      title: "Introduction to React Fundamentals",
      duration: "15:30",
      thumbnail: "/thumbnails/react-intro.jpg",
      completed: true,
      locked: false
    },
    {
      id: 2,
      title: "Components and Props Deep Dive",
      duration: "20:45",
      thumbnail: "/thumbnails/components.jpg",
      completed: false,
      locked: false
    },
    {
      id: 3,
      title: "State Management in React",
      duration: "18:20",
      thumbnail: "/thumbnails/state.jpg",
      completed: false,
      locked: true
    },
    {
      id: 4,
      title: "Working with React Hooks",
      duration: "25:15",
      thumbnail: "/thumbnails/hooks.jpg",
      completed: false,
      locked: true
    },
    {
      id: 5,
      title: "Building Custom Hooks",
      duration: "22:10",
      thumbnail: "/thumbnails/custom-hooks.jpg",
      completed: false,
      locked: true
    }
  ];

  const quizzes: Quiz[] = [
    {
      question: "What is the virtual DOM in React?",
      options: [
        "A direct copy of the actual DOM",
        "A lightweight copy of the actual DOM that React uses for performance optimization",
        "A database for storing React components",
        "A special browser extension for React"
      ],
      correctAnswer: 1
    },
    {
      question: "What is JSX in React?",
      options: [
        "A JavaScript library",
        "A database query language",
        "A syntax extension for JavaScript that allows writing HTML-like code",
        "A CSS framework"
      ],
      correctAnswer: 2
    },
    {
      question: "What are React hooks used for?",
      options: [
        "To connect to external APIs",
        "To style React components",
        "To add state and other React features to functional components",
        "To create new HTML elements"
      ],
      correctAnswer: 2
    },
    {
      question: "Which hook is used for side effects in React?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useReducer"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of the key prop in React lists?",
      options: [
        "To style list items",
        "To help React identify which items have changed, been added, or removed",
        "To make the list sortable",
        "To add click events to list items"
      ],
      correctAnswer: 1
    }
  ];

  const handleVideoSelect = (videoId: number) => {
    setSelectedVideo(videoId);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuizIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      const correctAnswers = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === quizzes[index].correctAnswer ? 1 : 0);
      }, 0);
      setScore(correctAnswers);
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuizIndex(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Course Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-emerald-400">Introduction to React</h1>
              <p className="text-zinc-400 mt-2">Master the fundamentals of React and build modern web applications</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`${isLiked ? 'text-red-500' : 'text-zinc-400'}`}
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`${isBookmarked ? 'text-emerald-500' : 'text-zinc-400'}`}
              >
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player or Video List */}
          <div className="lg:col-span-2 space-y-6">
            {selectedVideo ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    controls
                    src={`https://example.com/video-${selectedVideo}.mp4`}
                    poster={videos[selectedVideo - 1].thumbnail}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-emerald-400">
                    {videos[selectedVideo - 1].title}
                  </h2>
                  <Button
                    onClick={() => setShowQuiz(true)}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Take Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                      video.locked ? 'opacity-80' : ''
                    }`}
                    onClick={() => !video.locked && handleVideoSelect(video.id)}
                  >
                    <div className="bg-zinc-900/90 border border-emerald-500/20 rounded-lg p-4 flex items-center space-x-4">
                      <div className="relative w-32 h-20 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {video.locked ? (
                            <Lock className="w-8 h-8 text-white/80" />
                          ) : (
                            <Play className="w-8 h-8 text-white/80" />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-emerald-400 group-hover:text-emerald-300">
                          {video.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-zinc-400">{video.duration}</span>
                          {video.completed && (
                            <span className="flex items-center text-sm text-emerald-400">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Completed
                            </span>
                          )}
                          {video.locked && (
                            <span className="flex items-center text-sm text-zinc-400">
                              <Lock className="w-4 h-4 mr-1" />
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Course Progress */}
          <div className="space-y-6">
            <Card className="p-6 bg-zinc-900/90 border-emerald-500/20">
              <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
              <Progress value={20} className="h-2 mb-2" />
              <p className="text-sm text-zinc-400">1 of 5 lessons completed</p>
            </Card>
          </div>
        </div>

        {/* Quiz Modal */}
        <AnimatePresence>
          {showQuiz && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => !quizCompleted && setShowQuiz(false)}
              />
              
              {/* Quiz Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <Card className="w-full max-w-2xl mx-4 p-8 bg-zinc-900/95 border border-emerald-500/20 backdrop-blur-xl shadow-xl"
                style={{ margin: 'auto' }}>
                  {!quizCompleted ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-emerald-400">React Challenge</h2>
                        <span className="text-lg text-emerald-400/80">Question {currentQuizIndex + 1} of {quizzes.length}</span>
                      </div>
                      
                      <Progress 
                        value={(currentQuizIndex / quizzes.length) * 100} 
                        className="h-2 bg-emerald-500/20" 
                      />
                      
                      <div className="py-6">
                        <h3 className="text-xl text-white mb-6">{quizzes[currentQuizIndex].question}</h3>
                        <div className="space-y-4">
                          {quizzes[currentQuizIndex].options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-4 rounded-lg text-left transition-all ${
                                selectedAnswers[currentQuizIndex] === index
                                  ? "bg-emerald-500/20 border-emerald-500 text-white"
                                  : "bg-zinc-800/50 hover:bg-zinc-800/80 text-zinc-200"
                              } border text-lg`}
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowQuiz(false)}
                          className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                        >
                          Exit Quiz
                        </Button>
                        <Button
                          onClick={handleNextQuestion}
                          disabled={selectedAnswers[currentQuizIndex] === undefined}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                        >
                          {currentQuizIndex === quizzes.length - 1 ? "Finish" : "Next Question"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8 text-center"
                    >
                      <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-emerald-400">Quiz Completed!</h2>
                        <p className="text-xl text-zinc-300">You scored {score} out of {quizzes.length}</p>
                      </div>

                      <div className="p-8">
                        <div className="relative w-48 h-48 mx-auto">
                          <motion.div
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: score / quizzes.length }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="circular-progress"
                          >
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#059669"
                                strokeWidth="8"
                                strokeDasharray="283"
                                strokeDashoffset={283 * (1 - score / quizzes.length)}
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-4xl font-bold text-emerald-400">
                                {Math.round((score / quizzes.length) * 100)}%
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={resetQuiz}
                          className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                        >
                          Try Again
                        </Button>
                        <Button
                          onClick={() => setShowQuiz(false)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReactIntro;

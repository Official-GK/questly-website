import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayCircle, CheckCircle, Brain, Heart, Share2, BookmarkPlus } from "lucide-react";

const SmartLearning = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const courseData = {
    title: "Smart Learning with AI",
    description: "Master AI-powered learning techniques and boost your productivity with advanced learning strategies.",
    instructor: "Dr. Alex Chen",
    progress: 45,
    totalStudents: 2345,
    rating: 4.9,
    sections: [
      {
        id: 1,
        title: "Introduction to Smart Learning",
        videoUrl: "https://example.com/smart-learning-intro.mp4",
        duration: "12:30",
        completed: true,
      },
      {
        id: 2,
        title: "AI-Powered Study Techniques",
        videoUrl: "https://example.com/ai-study.mp4",
        duration: "15:45",
        completed: false,
      },
      {
        id: 3,
        title: "Personalized Learning Paths",
        videoUrl: "https://example.com/personalized-paths.mp4",
        duration: "18:20",
        completed: false,
      }
    ],
    quiz: {
      id: 1,
      question: "What is the main advantage of AI-powered learning?",
      options: [
        "It's more expensive",
        "Personalized learning paths",
        "No human interaction needed",
        "Faster internet required",
      ],
      correctAnswer: 1,
    },
  };

  const handleSectionClick = (index: number) => {
    setCurrentSection(index);
    setShowQuiz(false);
    if (videoRef.current) {
      videoRef.current.src = courseData.sections[index].videoUrl;
      videoRef.current.play();
    }
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer !== null) {
      setIsCorrect(selectedAnswer === courseData.quiz.correctAnswer);
    }
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
              <h1 className="text-4xl font-bold text-emerald-400">{courseData.title}</h1>
              <p className="text-zinc-400 mt-2">{courseData.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-sm text-zinc-500">Instructor: {courseData.instructor}</span>
                <span className="text-sm text-zinc-500">Students: {courseData.totalStudents}</span>
                <span className="text-sm text-zinc-500">Rating: {courseData.rating}/5.0</span>
              </div>
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
          <Progress value={courseData.progress} className="h-2 bg-zinc-700" />
          <p className="text-sm text-zinc-500">{courseData.progress}% Complete</p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player and Quiz Section */}
          <div className="lg:col-span-2 space-y-6">
            {!showQuiz ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    controls
                    src={courseData.sections[currentSection].videoUrl}
                    poster="/smart-learning-thumbnail.jpg"
                  />
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold">
                    {courseData.sections[currentSection].title}
                  </h3>
                  <p className="text-zinc-400 mt-2">
                    Duration: {courseData.sections[currentSection].duration}
                  </p>
                </div>
              </div>
            ) : (
              <Card className="p-6 space-y-6">
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-semibold">Quiz Time!</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-lg">{courseData.quiz.question}</p>
                  <div className="space-y-3">
                    {courseData.quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          selectedAnswer === index
                            ? "bg-emerald-500/20 border-emerald-500"
                            : "bg-zinc-800/50 hover:bg-zinc-800"
                        } border`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    Submit Answer
                  </Button>
                  {isCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {isCorrect ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span>Excellent! You've mastered this concept!</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-red-400" />
                          <span>Keep learning! Review the material and try again.</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Course Sections Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Course Sections</h2>
            <div className="space-y-3">
              {courseData.sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleSectionClick(index)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-4 rounded-lg flex items-center justify-between ${
                    currentSection === index
                      ? "bg-emerald-500/20 border-emerald-500"
                      : "bg-zinc-800/50 hover:bg-zinc-800"
                  } border transition-all`}
                >
                  <div className="flex items-center space-x-3">
                    {section.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-zinc-400" />
                    )}
                    <span>{section.title}</span>
                  </div>
                  <span className="text-sm text-zinc-500">{section.duration}</span>
                </motion.button>
              ))}
              <Button
                onClick={() => setShowQuiz(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                Take Quiz
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartLearning;

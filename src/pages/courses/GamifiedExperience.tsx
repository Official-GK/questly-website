import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayCircle, CheckCircle, Trophy, Heart, Share2, BookmarkPlus, Star } from "lucide-react";

const GamifiedExperience = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [points, setPoints] = useState(0);

  const courseData = {
    title: "Gamified Learning Experience",
    description: "Transform your learning journey into an exciting game. Earn rewards, compete with peers, and master new skills through engaging challenges.",
    instructor: "Prof. Maria Garcia",
    progress: 30,
    totalStudents: 3156,
    rating: 4.8,
    sections: [
      {
        id: 1,
        title: "Gamification Fundamentals",
        videoUrl: "https://example.com/gamification-intro.mp4",
        duration: "14:20",
        completed: true,
        points: 100,
      },
      {
        id: 2,
        title: "Reward Systems Design",
        videoUrl: "https://example.com/reward-systems.mp4",
        duration: "16:45",
        completed: false,
        points: 150,
      },
      {
        id: 3,
        title: "Competitive Learning Strategies",
        videoUrl: "https://example.com/competitive-learning.mp4",
        duration: "20:15",
        completed: false,
        points: 200,
      }
    ],
    quiz: {
      id: 1,
      question: "What is the key benefit of gamification in learning?",
      options: [
        "It makes learning more expensive",
        "It increases engagement and motivation",
        "It requires special gaming equipment",
        "It reduces learning time",
      ],
      correctAnswer: 1,
      points: 50,
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
      const correct = selectedAnswer === courseData.quiz.correctAnswer;
      setIsCorrect(correct);
      if (correct) {
        setPoints(points + courseData.quiz.points);
      }
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
              <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-bold text-emerald-400">{courseData.title}</h1>
                <div className="bg-emerald-500/20 px-4 py-2 rounded-full flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">{points} Points</span>
                </div>
              </div>
              <p className="text-zinc-400 mt-2">{courseData.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-sm text-zinc-500">Instructor: {courseData.instructor}</span>
                <span className="text-sm text-zinc-500">Students: {courseData.totalStudents}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-zinc-500">{courseData.rating}/5.0</span>
                </div>
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
                    poster="/gamification-thumbnail.jpg"
                  />
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {courseData.sections[currentSection].title}
                      </h3>
                      <p className="text-zinc-400 mt-2">
                        Duration: {courseData.sections[currentSection].duration}
                      </p>
                    </div>
                    <div className="bg-emerald-500/20 px-3 py-1 rounded-full flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">+{courseData.sections[currentSection].points} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-2xl font-semibold">Challenge Time!</h2>
                  </div>
                  <div className="bg-emerald-500/20 px-3 py-1 rounded-full flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">+{courseData.quiz.points} pts</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-lg">{courseData.quiz.question}</p>
                  <div className="space-y-3">
                    {courseData.quiz.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        whileHover={{ scale: 1.01 }}
                        className={`w-full p-4 rounded-lg text-left transition-all ${
                          selectedAnswer === index
                            ? "bg-emerald-500/20 border-emerald-500"
                            : "bg-zinc-800/50 hover:bg-zinc-800"
                        } border`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    Submit Challenge
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
                          <Trophy className="w-5 h-5 text-emerald-400" />
                          <span>Challenge Complete! +{courseData.quiz.points} points!</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-5 h-5 text-red-400" />
                          <span>Try again! Every attempt makes you stronger!</span>
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
            <h2 className="text-xl font-semibold">Course Challenges</h2>
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
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-zinc-500">{section.duration}</span>
                    <div className="bg-emerald-500/20 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Trophy className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">+{section.points}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
              <Button
                onClick={() => setShowQuiz(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center space-x-2"
              >
                <Trophy className="w-5 h-5" />
                <span>Start Challenge</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamifiedExperience;

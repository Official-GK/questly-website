import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, MessageSquare, Trophy, Play, CheckCircle, PauseCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
  completed?: boolean;
  videoUrl?: string;
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface CourseTemplateProps {
  title: string;
  description: string;
  topics: string[];
  chapters: Chapter[];
}

export default function CourseTemplate({ title, description, topics, chapters }: CourseTemplateProps) {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const completedChapters = chapters.filter(chapter => chapter.completed).length;
  const progress = (completedChapters / chapters.length) * 100;

  const handleStartChapter = (chapter: Chapter) => {
    navigate("/courses/video", {
      state: {
        courseTitle: title,
        chapterTitle: chapter.title,
        videoUrl: chapter.videoUrl,
        quiz: chapter.quiz
      }
    });
  };

  const handleQuiz = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setShowQuiz(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Course Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-muted-foreground mb-6">{description}</p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Course Progress</h2>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {completedChapters} of {chapters.length} chapters completed
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="w-full md:w-80">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => navigate("/flashcards")}>
                <Brain className="mr-2 h-4 w-4" /> Practice Flashcards
              </Button>
              <Button className="w-full" onClick={() => navigate("/quiz")}>
                <Trophy className="mr-2 h-4 w-4" /> Take Quiz
              </Button>
              <Button className="w-full" onClick={() => navigate("/ai")}>
                <MessageSquare className="mr-2 h-4 w-4" /> Ask AI Assistant
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!currentVideo} onOpenChange={() => setCurrentVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{currentChapter?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black relative">
            {/* Video player would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <PauseCircle className="w-16 h-16 text-white" />
                ) : (
                  <Play className="w-16 h-16 text-white" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setCurrentVideo(null)}>
              Close
            </Button>
            {currentChapter?.quiz && (
              <Button onClick={() => handleQuiz(currentChapter)}>
                Take Chapter Quiz
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={() => setShowQuiz(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chapter Quiz: {currentChapter?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentChapter?.quiz?.questions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-2">
                <p className="font-medium">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <Button
                      key={oIndex}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        // Handle answer selection
                        if (oIndex === q.correctAnswer) {
                          // Handle correct answer
                        }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="chapters" className="mt-12">
        <TabsList>
          <TabsTrigger value="chapters">Course Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>
        <TabsContent value="chapters">
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{chapter.title}</h3>
                      {chapter.completed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{chapter.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">{chapter.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleStartChapter(chapter)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {chapter.completed ? "Review" : "Start"}
                    </Button>
                    {chapter.quiz && (
                      <Button
                        variant="secondary"
                        onClick={() => handleQuiz(chapter)}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Quiz
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="resources">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Course Resources</h3>
            <ul className="space-y-2">
              <li>📚 Course Slides</li>
              <li>📝 Practice Exercises</li>
              <li>🔗 Useful Links</li>
              <li>📖 Additional Reading</li>
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="discussion">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Course Discussion</h3>
            <p className="text-muted-foreground">
              Join the discussion with other students and instructors.
              Ask questions, share insights, and collaborate on projects.
            </p>
            <Button className="mt-4">Join Discussion</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

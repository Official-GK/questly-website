import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseVideoPlayer } from "@/components/courses/CourseVideoPlayer";
import { CourseQuiz } from "@/components/courses/CourseQuiz";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";

export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const { userProfile } = useAuth();
  const isPremiumUser = userProfile?.isPremium || false;

  // Find course data
  const course = courses.find(c => c.id === courseId);

  // Redirect to courses page if course not found
  useEffect(() => {
    if (!course) {
      navigate('/courses');
    }
  }, [course, navigate]);

  if (!course || !course.videos || course.videos.length === 0) {
    return null;
  }

  const currentVideoData = course.videos[currentVideo];

  const handleVideoComplete = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number) => {
    if (score >= 70) {
      setCompletedVideos(prev => {
        if (!prev.includes(currentVideoData.id)) {
          return [...prev, currentVideoData.id];
        }
        return prev;
      });
      setShowQuiz(false);

      if (currentVideo + 1 < course.videos.length) {
        setCurrentVideo(currentVideo + 1);
      }
    }
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {showQuiz ? (
            <CourseQuiz
              title={`Quiz: ${currentVideoData.title}`}
              questions={currentVideoData.quiz?.questions || []}
              onComplete={handleQuizComplete}
            />
          ) : (
            <CourseVideoPlayer
              videoUrl={currentVideoData.videoUrl}
              onComplete={handleVideoComplete}
            />
          )}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
            <div className="flex items-center gap-2">
              <Badge>{course.level}</Badge>
              <Badge variant="outline">{course.duration}</Badge>
              {course.isPremium && isPremiumUser && (
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Course Content</h2>
          <div className="space-y-2">
            {course.videos.map((video, index) => (
              <Button
                key={video.id}
                variant={currentVideo === index ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setCurrentVideo(index);
                  setShowQuiz(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {completedVideos.includes(video.id) && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span>
                    {index + 1}. {video.title}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

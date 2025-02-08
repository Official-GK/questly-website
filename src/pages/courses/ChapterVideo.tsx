import { useLocation, useNavigate } from "react-router-dom";
import VideoPlayer from "@/components/courses/VideoPlayer";

export default function ChapterVideo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseTitle, chapterTitle, videoUrl, quiz } = location.state || {
    courseTitle: "Course",
    chapterTitle: "Chapter",
    videoUrl: "",
    quiz: null
  };

  const handleComplete = () => {
    // Here you would typically update the user's progress
    // For now, we'll just navigate back
    navigate(-1);
  };

  return (
    <VideoPlayer
      videoUrl={videoUrl}
      title={courseTitle}
      chapterTitle={chapterTitle}
      onComplete={handleComplete}
      quiz={quiz}
    />
  );
}

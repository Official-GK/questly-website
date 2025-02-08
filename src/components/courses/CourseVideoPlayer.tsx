import { useState, useEffect, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface CourseVideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

export function CourseVideoPlayer({ videoUrl, onComplete }: CourseVideoPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying && progress < 100) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            if (intervalId) clearInterval(intervalId);
            handleComplete();
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, handleComplete]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video rounded-lg bg-black/90 flex items-center justify-center relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-gradient" />
        
        {/* Progress circle in the middle */}
        <div className="relative z-10 text-center">
          <div className="text-4xl font-bold mb-2">{progress}%</div>
          <Button 
            size="lg"
            onClick={togglePlay}
            className="bg-white/10 hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

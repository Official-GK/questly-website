import { Play, Clock, Users, Award } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FeaturedCardProps {
  title: string;
  description: string;
  image: string;
  progress: number;
  duration: string;
  students: number;
  level: string;
  xp: number;
  tags: string[];
  onClick?: () => void;
  className?: string;
}

export function FeaturedCard({
  title,
  description,
  image,
  progress,
  duration,
  students,
  level,
  xp,
  tags,
  onClick,
  className,
}: FeaturedCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <SpotlightCard
      className={cn("relative overflow-hidden", className)}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        "--spotlight-x": `${position.x}px`,
        "--spotlight-y": `${position.y}px`,
        "--spotlight-opacity": opacity,
      } as React.CSSProperties}
    >
      <div className="relative z-10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClick}>
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{students} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{level}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">XP:</span>
          <span className="text-sm text-muted-foreground">{xp}</span>
        </div>
      </div>
    </SpotlightCard>
  );
}

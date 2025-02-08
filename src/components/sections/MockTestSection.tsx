import { useSpotlightAnimation } from "@/hooks/useSpotlightAnimation";
import { ChevronRight, Clock, GraduationCap, Trophy } from "lucide-react";

interface MockTestSectionProps {
  totalTests?: number;
  completedTests?: number;
  bestScore?: number;
  averageTime?: string;
  onClick?: () => void;
  className?: string;
}

export function MockTestSection({
  totalTests = 0,
  completedTests = 0,
  bestScore = 0,
  averageTime = "0min",
  onClick,
  className,
}: MockTestSectionProps) {
  const { divRef, position, opacity, handlers } = useSpotlightAnimation();

  return (
    <div
      ref={divRef}
      {...handlers}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[32px] bg-[#282828] p-6 transition-all duration-300 hover:bg-[#3E3E3E] hover:-translate-y-1 ${className}`}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(29, 185, 84, 0.4), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#1DB954]/10 p-3">
              <GraduationCap className="h-6 w-6 text-[#1DB954]" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-[#1DB954] transition-colors">
              Mock Tests
            </h3>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#1DB954]" />
              <p className="text-sm text-[#B3B3B3]">Best Score</p>
            </div>
            <p className="text-2xl font-bold text-white">{bestScore}%</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#1DB954]" />
              <p className="text-sm text-[#B3B3B3]">Avg. Time</p>
            </div>
            <p className="text-2xl font-bold text-white">{averageTime}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#B3B3B3]">Progress</span>
            <span className="text-[#B3B3B3]">{completedTests}/{totalTests} completed</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#3E3E3E]">
            <div
              className="h-full bg-[#1DB954] transition-all duration-300"
              style={{
                width: `${(completedTests / totalTests) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="absolute bottom-6 right-6 transform transition-transform duration-300 group-hover:translate-x-1">
          <ChevronRight className="h-5 w-5 text-[#1DB954]" />
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute -right-8 -top-8 h-32 w-32 opacity-5">
        <GraduationCap className="h-full w-full text-white" />
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-[32px] transition-opacity duration-500 group-hover:opacity-100 opacity-0" 
           style={{ 
             boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" 
           }} 
      />
    </div>
  );
}

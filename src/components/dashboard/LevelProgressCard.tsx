import { Trophy } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LevelProgressCardProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  className?: string;
}

export function LevelProgressCard({ currentXP, requiredXP, level, className }: LevelProgressCardProps) {
  const progress = Math.min((currentXP / requiredXP) * 100, 100);

  return (
    <GradientCard theme="green" className={cn("group relative overflow-hidden", className)}>
      <div className="relative z-10 space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">Level {level}</h3>
            <p className="text-[#B3B3B3]">Keep going! You're doing great!</p>
          </div>
          <Trophy className="h-8 w-8 text-emerald-400" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-white">{currentXP.toLocaleString()} XP</span>
            <span className="text-[#B3B3B3]">{requiredXP.toLocaleString()} XP</span>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-[#1E1E1E]"
              indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
            <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-opacity duration-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-[#1E1E1E] p-4 transition-all hover:bg-emerald-500/10">
            <div className="text-sm text-[#B3B3B3]">Next Level</div>
            <div className="text-2xl font-bold text-white">{level + 1}</div>
          </div>
          <div className="rounded-lg bg-[#1E1E1E] p-4 transition-all hover:bg-emerald-500/10">
            <div className="text-sm text-[#B3B3B3]">XP Needed</div>
            <div className="text-2xl font-bold text-white">
              {(requiredXP - currentXP).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Background Trophy Icon */}
      <div className="absolute -right-8 -top-8 h-48 w-48 opacity-[0.05]">
        <Trophy className="h-full w-full text-emerald-500" />
      </div>
    </GradientCard>
  );
}

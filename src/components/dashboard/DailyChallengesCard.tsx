import { Star, Check } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Challenge {
  title: string;
  description: string;
  xpReward: number;
  progress?: number;
  timeLeft?: string;
  completed?: boolean;
}

interface DailyChallengesCardProps {
  challenges: Challenge[];
  completedCount: number;
  totalCount: number;
  className?: string;
}

export function DailyChallengesCard({
  challenges,
  completedCount,
  totalCount,
  className,
}: DailyChallengesCardProps) {
  const progress = (completedCount / totalCount) * 100;

  return (
    <GradientCard theme="green" className={cn("group relative overflow-hidden", className)}>
      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">Daily Challenges</h3>
            <p className="text-[#B3B3B3]">
              {completedCount} of {totalCount} challenges completed
            </p>
          </div>
          <Star className="h-8 w-8 text-emerald-400" />
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-[#1E1E1E]"
              indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
            <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-opacity duration-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className={cn(
                "group/item rounded-lg bg-[#1E1E1E] p-4 transition-all",
                challenge.completed
                  ? "border border-emerald-500/20 bg-emerald-500/5"
                  : "hover:bg-emerald-500/10"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{challenge.title}</h4>
                    {challenge.completed && (
                      <div className="rounded-full bg-emerald-500/20 p-1">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#B3B3B3]">{challenge.description}</p>
                  {challenge.timeLeft && (
                    <p className="text-sm text-emerald-400">{challenge.timeLeft}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-sm text-emerald-400">
                  <Star className="h-4 w-4" />
                  <span>+{challenge.xpReward} XP</span>
                </div>
              </div>
              {challenge.progress !== undefined && (
                <div className="mt-3 space-y-1">
                  <div className="relative">
                    <Progress 
                      value={challenge.progress} 
                      className="h-2 bg-[#1E1E1E]"
                      indicatorClassName="bg-gradient-to-r from-emerald-500 to-emerald-400"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.2)] transition-opacity duration-300 group-hover/item:shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                  </div>
                  <div className="flex justify-end">
                    <span className="text-xs text-[#B3B3B3]">{challenge.progress}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Background Star Icon */}
      <div className="absolute -right-8 -top-8 h-48 w-48 opacity-[0.05]">
        <Star className="h-full w-full text-emerald-500" />
      </div>
    </GradientCard>
  );
}

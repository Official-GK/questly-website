import { Flame } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { cn } from "@/lib/utils";

interface Activity {
  day: string;
  active: boolean;
}

interface LearningStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  weekActivity: Activity[];
  className?: string;
}

export function LearningStreakCard({
  currentStreak,
  longestStreak,
  weekActivity,
  className,
}: LearningStreakCardProps) {
  return (
    <GradientCard theme="green" className={cn("group relative overflow-hidden", className)}>
      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">Learning Streak</h3>
            <p className="text-[#B3B3B3]">Keep the momentum going!</p>
          </div>
          <Flame className="h-8 w-8 text-emerald-400" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-[#1E1E1E] p-4 transition-all hover:bg-emerald-500/10">
            <div className="text-sm text-[#B3B3B3]">Current Streak</div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-emerald-400" />
              <span className="text-2xl font-bold text-white">{currentStreak}</span>
              <span className="text-sm text-[#B3B3B3]">days</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#1E1E1E] p-4 transition-all hover:bg-emerald-500/10">
            <div className="text-sm text-[#B3B3B3]">Longest Streak</div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-emerald-400" />
              <span className="text-2xl font-bold text-white">{longestStreak}</span>
              <span className="text-sm text-[#B3B3B3]">days</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div>
          <h4 className="mb-4 font-medium text-white">Weekly Activity</h4>
          <div className="grid grid-cols-7 gap-2">
            {weekActivity.map((day, index) => (
              <div key={index} className="space-y-2 text-center">
                <div
                  className={cn(
                    "mx-auto h-8 w-8 rounded-lg transition-all",
                    day.active
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-[#1E1E1E]"
                  )}
                />
                <span className="text-xs text-[#B3B3B3]">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Flame Icon */}
      <div className="absolute -right-8 -top-8 h-48 w-48 opacity-[0.05]">
        <Flame className="h-full w-full text-emerald-500" />
      </div>
    </GradientCard>
  );
}

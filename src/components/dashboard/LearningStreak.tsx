import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface LearningStreakProps {
  streak: number;
}

export function LearningStreak({ streak }: LearningStreakProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Generate mock weekly activity based on the streak
  const weeklyActivity = days.map(() => Math.floor(Math.random() * 100));

  return (
    <Card className="p-6">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Learning Streak</h3>
          <p className="text-sm text-muted-foreground">Keep up the momentum!</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full">
          <Flame className="h-4 w-4" />
          <span className="font-medium">{streak} days</span>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-background rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-2xl font-bold">{streak} days</p>
        </div>
        <div className="bg-background rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Longest Streak</p>
          <p className="text-2xl font-bold">{streak} days</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">This Week's Activity</h4>
        <div className="grid grid-cols-7 gap-2">
          {weeklyActivity.map((activity, i) => (
            <div key={i} className="space-y-2">
              <div className="h-24 bg-muted rounded-lg relative">
                <div
                  className="absolute bottom-0 w-full bg-orange-500 rounded-lg transition-all"
                  style={{ height: `${activity}%` }}
                />
              </div>
              <div className="text-center text-xs text-muted-foreground">
                {days[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

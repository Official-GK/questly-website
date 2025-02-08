import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle2, Timer, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Challenge {
  id: number;
  title: string;
  description: string;
  xp: number;
  progress: number;
  completed: boolean;
  timeLeft?: string;
}

interface DailyChallengesProps {
  challenges: Challenge[];
}

export function DailyChallenges({ challenges }: DailyChallengesProps) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Daily Challenges</h3>
          <p className="text-sm text-muted-foreground">Complete for bonus XP!</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
          <Target className="h-4 w-4" />
          <span className="font-medium">3/5 Done</span>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={cn(
              "p-4 rounded-lg transition-colors",
              challenge.completed ? "bg-primary/5" : "bg-muted/50",
              "group hover:bg-primary/10"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  {challenge.title}
                  {challenge.completed && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Zap className="h-4 w-4" />
                <span className="font-medium">+{challenge.xp} XP</span>
              </div>
            </div>

            <div className="space-y-3">
              {!challenge.completed && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </>
              )}

              <div className="flex items-center justify-between">
                {challenge.timeLeft && !challenge.completed && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>{challenge.timeLeft} left</span>
                  </div>
                )}
                <Button
                  variant={challenge.completed ? "outline" : "default"}
                  size="sm"
                  className={cn(
                    "ml-auto",
                    challenge.completed && "text-green-500"
                  )}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? "Completed" : "Start Challenge"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Bonus */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium">Daily Bonus</h4>
            <p className="text-xs text-muted-foreground">Complete all challenges</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Zap className="h-4 w-4" />
            <span className="font-medium">+1000 XP</span>
          </div>
        </div>
        <Progress value={60} className="h-2" />
      </div>
    </Card>
  );
}

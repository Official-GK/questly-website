import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface XPProgressProps {
  xp: number;
}

export function XPProgress({ xp }: XPProgressProps) {
  // Calculate level and progress
  const xpPerLevel = 1000;
  const currentLevel = Math.floor(xp / xpPerLevel);
  const xpInCurrentLevel = xp % xpPerLevel;
  const progress = (xpInCurrentLevel / xpPerLevel) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Level Progress</h3>
          <p className="text-sm text-muted-foreground">
            {xpInCurrentLevel} / {xpPerLevel} XP to Level {currentLevel + 1}
          </p>
        </div>
        <div className="text-sm font-medium">
          Level {currentLevel}
        </div>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="mt-4 text-sm text-muted-foreground">
        {Math.floor(xpPerLevel - xpInCurrentLevel)} XP needed for next level
      </div>
    </Card>
  );
}

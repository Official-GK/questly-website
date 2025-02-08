import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Trophy, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  avatar?: string;
  rank: number;
}

// Mock data - in a real app, this would come from your backend
const topUsers: LeaderboardUser[] = [
  { id: "1", name: "Sarah Chen", xp: 12500, rank: 1 },
  { id: "2", name: "Alex Kim", xp: 11200, rank: 2 },
  { id: "3", name: "Mike Johnson", xp: 10800, rank: 3 },
  { id: "4", name: "Emma Davis", xp: 9900, rank: 4 },
  { id: "5", name: "Chris Lee", xp: 9500, rank: 5 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Award className="h-4 w-4 text-amber-600" />;
    default:
      return null;
  }
};

export function Leaderboard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Top Learners</CardTitle>
        <Button 
          variant="ghost" 
          className="text-sm text-muted-foreground hover:text-primary"
          onClick={() => navigate("/leaderboard")}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {topUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-6 text-center">
                {getRankIcon(user.rank) || <span className="text-muted-foreground">{user.rank}</span>}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Level {Math.floor(user.xp / 1000)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

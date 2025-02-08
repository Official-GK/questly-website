import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const leaderboardData = [
  { id: 1, name: "Lee Taeyong", xp: 258244, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
  { id: 2, name: "Mark Lee", xp: 258242, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
  { id: 3, name: "Xiao Dejun", xp: 258223, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
  { id: 4, name: "Liu YangYang", xp: 257890, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4" },
  { id: 5, name: "Qian Kun", xp: 257456, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5" }
];

// Generate more data for the full leaderboard
const names = [
  "John Smith", "Emma Davis", "Michael Chen", "Sarah Wilson", "David Kim",
  "Lisa Park", "James Brown", "Maria Garcia", "Robert Lee", "Anna Wang",
  "Thomas Nguyen", "Jennifer Wu", "William Liu", "Elizabeth Zhang", "Richard Tan",
  "Jessica Lin", "Daniel Wong", "Michelle Zhao", "Kevin Choi", "Rachel Kim",
  "Joseph Park", "Emily Chen", "Christopher Lee", "Amanda Liu", "Brian Wang",
  "Sophie Zhang", "Ryan Wu", "Olivia Yang", "Justin Chen", "Grace Kim",
  "Steven Park", "Catherine Lee", "Matthew Wong", "Victoria Lin", "Andrew Liu",
  "Hannah Chen", "Benjamin Kim", "Samantha Wu", "Alexander Park", "Nicole Zhang"
];

const fullLeaderboardData = Array(40).fill(null).map((_, index) => {
  if (index < leaderboardData.length) {
    return leaderboardData[index];
  }
  return {
    id: index + 1,
    name: names[index],
    xp: Math.floor(257000 - (index * 1000)),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index + 1}`
  };
});

export function LeaderboardCard() {
  const [showFullRanking, setShowFullRanking] = useState(false);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-400";
      case 2:
        return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 text-gray-300";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 text-amber-600";
      default:
        return "bg-[#252525]/40 text-[#B3B3B3]";
    }
  };

  return (
    <>
      <div className="rounded-xl border border-white/5 bg-[#252525]/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#B3B3B3]" />
            <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
          </div>
          <Button
            variant="link"
            className="text-[#B3B3B3] hover:text-white"
            onClick={() => setShowFullRanking(true)}
          >
            View Full Ranking
          </Button>
        </div>

        <div className="space-y-4">
          {leaderboardData.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-purple-500/30 bg-[#252525]/40 hover:bg-[#252525] transition-all"
            >
              {/* Rank and Avatar */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={getRankColor(index + 1) + " flex h-8 w-8 items-center justify-center rounded-xl font-semibold shrink-0"}>
                  {index + 1}
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-xl bg-[#252525]/40 shrink-0"
                />
                <div className="overflow-x-auto min-w-0">
                  <span className="font-medium text-white whitespace-nowrap">
                    {user.name}
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Trophy className="h-4 w-4 text-[#B3B3B3]" />
                <span className="text-[#B3B3B3] whitespace-nowrap">
                  {user.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showFullRanking} onOpenChange={setShowFullRanking}>
        <DialogContent className="!rounded-[32px] bg-[#252525]/40 border-white/5 p-6 max-w-2xl max-h-[80vh] rounded-3xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#252525]/40 border border-white/5">
                <Trophy className="h-6 w-6 text-[#B3B3B3]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Full Leaderboard</h2>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
              {fullLeaderboardData.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-white/10 bg-[#252525]/40 hover:bg-[#252525] transition-all"
                >
                  {/* Rank and Avatar */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={getRankColor(index + 1) + " flex h-8 w-8 items-center justify-center rounded-xl font-semibold shrink-0"}>
                      {index + 1}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-xl bg-[#252525]/40 shrink-0"
                    />
                    <div className="overflow-x-auto min-w-0">
                      <span className="font-medium text-white whitespace-nowrap">
                        {user.name}
                      </span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Trophy className="h-4 w-4 text-[#B3B3B3]" />
                    <span className="text-[#B3B3B3] whitespace-nowrap">
                      {user.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

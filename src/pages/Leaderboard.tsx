import { cn } from "@/lib/utils";
import { ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { leaderboardData } from "@/components/dashboard/LeaderboardCard";

// Extended leaderboard data with the same structure as dashboard
const fullLeaderboardData = Array(50).fill(null).map((_, index) => ({
  id: index < leaderboardData.length ? leaderboardData[index].id : `user-${index + 1}`,
  name: index < leaderboardData.length ? leaderboardData[index].name : `Player ${index + 1} with a very long name that should scroll horizontally`,
  xp: index < leaderboardData.length ? leaderboardData[index].xp : Math.floor(20000 - (index * 300)),
  avatar: index < leaderboardData.length ? leaderboardData[index].avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
}));

export default function Leaderboard() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#151515] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-[#B3B3B3] mt-2">View all top performers</p>
        </div>

        {/* Fixed Block with Scrollable Names */}
        <div className="mb-8 p-6 rounded-xl border border-white/5 bg-[#252525]/40">
          <h2 className="text-xl font-semibold mb-4">Quick View</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#252525]/40">
            {/* Fixed Rank */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl font-semibold shrink-0 bg-yellow-400/20 text-yellow-400">
              1
            </div>
            {/* Fixed Avatar */}
            <img
              src={fullLeaderboardData[0].avatar}
              alt={fullLeaderboardData[0].name}
              className="h-10 w-10 rounded-xl bg-[#252525]/40 shrink-0"
            />
            {/* Scrollable Names Container */}
            <div className="flex-1 overflow-x-auto min-w-0 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
              <div className="flex gap-4 min-w-max px-2">
                {fullLeaderboardData.map(user => (
                  <span key={user.id} className="font-medium text-white whitespace-nowrap">
                    {user.name}
                  </span>
                ))}
              </div>
            </div>
            {/* Fixed XP */}
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 whitespace-nowrap font-semibold">
                {fullLeaderboardData[0].xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {fullLeaderboardData.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-purple-500/30 bg-[#252525]/40 hover:bg-[#252525] transition-all"
            >
              {/* Rank and Avatar */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl font-semibold shrink-0",
                  getRankColor(index + 1)
                )}>
                  {index + 1}
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-xl bg-[#252525]/40 shrink-0"
                />
                <div className="overflow-x-auto min-w-0">
                  <span className="font-medium text-white whitespace-nowrap">
                    {user.name}
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#B3B3B3]" />
                  <span className="text-[#B3B3B3] whitespace-nowrap">
                    {user.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
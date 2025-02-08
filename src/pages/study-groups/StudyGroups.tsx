import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function StudyGroups() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCreateClick = () => {
    if (!currentUser) {
      toast.error("Please sign in to create a group");
      return;
    }
    navigate('/study-groups/create');
  };

  const handleJoinClick = () => {
    if (!currentUser) {
      toast.error("Please sign in to join a group");
      return;
    }
    navigate('/study-groups/join');
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Study Groups</h1>
        <p className="text-gray-400">Join a study group to collaborate with others</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={handleCreateClick}
          className="flex flex-col items-center justify-center p-8 bg-[#1F2937] rounded-2xl hover:bg-gray-800 transition-colors group"
        >
          <Users className="w-12 h-12 mb-4 text-[#3B82F6] group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Create a Group</h3>
          <p className="text-gray-400 text-center">Start your own study group and invite others to join</p>
        </button>

        <button
          onClick={handleJoinClick}
          className="flex flex-col items-center justify-center p-8 bg-[#1F2937] rounded-2xl hover:bg-gray-800 transition-colors group"
        >
          <Users className="w-12 h-12 mb-4 text-[#3B82F6] group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Join a Group</h3>
          <p className="text-gray-400 text-center">Join an existing study group using an invite code</p>
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-[#1F2937] rounded-2xl p-12 text-center">
        <p className="text-xl font-medium text-gray-200 mb-2">No study groups yet</p>
        <p className="text-gray-400">Create or join a group to study together!</p>
      </div>
    </div>
  );
}

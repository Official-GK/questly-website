import { useNavigate } from "react-router-dom";
import { Users, Mic, MessageSquare, Brain, Clock, ChevronRight } from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";
import { Badge } from "@/components/ui/badge";

interface StudyGroup {
  id: string;
  name: string;
  topic: string;
  members: number;
  activeNow: number;
  nextSession: string;
  image: string;
}

const sampleGroups: StudyGroup[] = [
  {
    id: "1",
    name: "Web Dev Masters",
    topic: "React & TypeScript",
    members: 8,
    activeNow: 3,
    nextSession: "Today, 7:00 PM",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    name: "Algorithm Study Circle",
    topic: "Data Structures",
    members: 6,
    activeNow: 2,
    nextSession: "Tomorrow, 6:30 PM",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
  }
];

function StudyGroupCard({ group }: { group: StudyGroup }) {
  const navigate = useNavigate();

  return (
    <GradientCard 
      theme="blue"
      className="group cursor-pointer transition-all hover:scale-[1.02]"
      onClick={() => navigate(`/study-groups/${group.id}`)}
    >
      <div className="flex flex-col gap-4">
        {/* Group Image */}
        <div className="relative h-40 overflow-hidden rounded-lg">
          <img
            src={group.image}
            alt={group.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Active Members Badge */}
          <Badge 
            className="absolute top-3 right-3 bg-green-500/90 text-white"
            variant="secondary"
          >
            {group.activeNow} Active Now
          </Badge>
        </div>

        {/* Group Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{group.name}</h3>
            <p className="text-sm text-[#B3B3B3]">{group.topic}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-[#B3B3B3]">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{group.members} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{group.nextSession}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              <Mic className="mr-1 h-3 w-3" /> Voice Chat
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              <MessageSquare className="mr-1 h-3 w-3" /> Text Chat
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              <Brain className="mr-1 h-3 w-3" /> Study Tools
            </Badge>
          </div>
        </div>

        {/* Join Arrow */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-6 w-6 text-white" />
        </div>
      </div>
    </GradientCard>
  );
}

export function StudyGroupsCard() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-500/20 p-2.5">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Study Groups</h2>
            <p className="text-sm text-[#B3B3B3]">Learn together, grow together</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/study-groups/create')}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Create New Group
        </button>
      </div>

      {/* Study Groups Grid */}
      {sampleGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleGroups.map((group) => (
            <StudyGroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <GradientCard 
          theme="blue"
          className="p-12 text-center cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => navigate('/study-groups/create')}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-blue-500/20 p-4">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">No study groups yet</h3>
              <p className="text-[#B3B3B3]">Create or join a group to start learning together!</p>
            </div>
            <Badge className="mt-4 bg-blue-500/20 text-blue-400">
              Click to Create a Group
            </Badge>
          </div>
        </GradientCard>
      )}
    </div>
  );
}

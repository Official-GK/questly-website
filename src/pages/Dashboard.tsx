import { useAuth } from "@/contexts/AuthContext";
import { Flame, Medal, Star, Trophy, Target, Brain, Zap, Award, Crown, Clock, BookOpen, Users } from "lucide-react";
import { LevelProgressCard } from "@/components/dashboard/LevelProgressCard";
import { DailyChallengesCard } from "@/components/dashboard/DailyChallengesCard";
import { LearningStreakCard } from "@/components/dashboard/LearningStreakCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LearningTools } from "@/components/dashboard/LearningTools";
import { LeaderboardCard } from "@/components/dashboard/LeaderboardCard";
import { StudyGroupsCard } from "@/components/dashboard/StudyGroupsCard";
import { GradientCard } from "@/components/ui/gradient-card";
import { Badge } from "@/components/ui/badge";
import { ChittiAI } from "@/components/ChittiAI";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development, including HTML, CSS, and JavaScript.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    path: "/courses/web-development",
    chapters: 4,
    duration: "8 hours",
    xp: 2600
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    description: "Master the fundamental data structures and algorithms.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
    path: "/courses/data-structures-and-algorithms",
    chapters: 4,
    duration: "10 hours",
    xp: 2600
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning concepts and algorithms.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=80",
    path: "/courses/machine-learning-basics",
    chapters: 4,
    duration: "12 hours",
    xp: 2600
  },
  {
    id: 4,
    title: "System Design",
    description: "Learn how to design scalable systems and architectures.",
    progress: 0,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    path: "/courses/system-design",
    chapters: 4,
    duration: "10 hours",
    xp: 2600
  }
];

function CourseCard({ course, className }: { course: typeof courses[0], className?: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(course.path);
  };

  return (
    <GradientCard 
      theme="teal" 
      className={cn("group h-full cursor-pointer transition-all hover:scale-[1.02]", className)}
      onClick={handleClick}
    >
      <div className="flex h-full flex-col gap-4">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden rounded-lg">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E1E1E]">
              <div 
                className="h-full bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6]" 
                style={{ width: `${course.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
            <p className="text-sm text-[#B3B3B3]">{course.description}</p>
          </div>

          {/* Course Stats */}
          <div className="mt-auto flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-[#B3B3B3]">
              <BookOpen className="h-4 w-4" />
              <span>{course.chapters} chapters</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-[#B3B3B3]">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="ml-auto flex items-center gap-1 rounded-full bg-[#2DD4BF]/20 px-2 py-1 text-sm text-[#2DD4BF]">
              <Zap className="h-4 w-4" />
              <span>+{course.xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </GradientCard>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentXP = 0;
  const currentLevel = 0;
  const streak = 0;
  const coursesCompleted = 0;
  const dailyGoal = 100;

  const handleViewAllCourses = () => {
    navigate('/courses');
  };

  return (
    <div className="container space-y-8 py-8">
      {/* Welcome Message */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName}!</h2>
          <p className="text-[#B3B3B3]">
            Track your progress and keep learning
          </p>
        </div>
        <ChittiAI position="top-right" className="relative h-10 w-10 top-0 right-0" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total XP"
          value={currentXP}
          subtitle="Experience Points"
          icon={Trophy}
          theme="green"
        />
        <StatsCard
          title="Daily Streak"
          value={streak}
          subtitle="Days"
          icon={Flame}
          theme="orange"
        />
        <StatsCard
          title="Courses Completed"
          value={coursesCompleted}
          subtitle="Courses"
          icon={Medal}
          theme="purple"
        />
        <StatsCard
          title="Daily Goal"
          value={`${Math.min(currentXP, dailyGoal)}/${dailyGoal}`}
          subtitle="XP Today"
          icon={Target}
          theme="blue"
        />
      </div>

      {/* Learning Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Learning Tools</h2>
          <p className="text-[#B3B3B3]">Choose your learning method</p>
        </div>
        <LearningTools />
      </div>

      {/* Study Groups */}
      <StudyGroupsCard />

      {/* Progress and Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LevelProgressCard
          currentXP={currentXP}
          requiredXP={1000}
          level={currentLevel}
          className="w-full"
        />
        <LeaderboardCard />
      </div>

      {/* Daily Challenges and Learning Streak */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DailyChallengesCard
          challenges={[
            {
              title: "Complete Python Basics",
              description: "Finish Chapter 1 of Python course",
              xpReward: 200,
              progress: 75,
              timeLeft: "2 hours left",
            },
            {
              title: "Daily Quiz Challenge",
              description: "Score 80% or higher on today's quiz",
              xpReward: 150,
              completed: true,
            },
            {
              title: "Practice Problems",
              description: "Complete 5 practice problems",
              xpReward: 300,
            },
          ]}
          completedCount={3}
          totalCount={5}
          className="w-full"
        />
        <LearningStreakCard
          currentStreak={streak}
          longestStreak={streak}
          weekActivity={[
            { day: "Mon", active: false },
            { day: "Tue", active: false },
            { day: "Wed", active: true },
            { day: "Thu", active: true },
            { day: "Fri", active: true },
            { day: "Sat", active: false },
            { day: "Sun", active: true },
          ]}
          className="w-full"
        />
      </div>

      {/* Study Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Study Groups</h2>
          <p className="text-[#B3B3B3]">Join a study group to collaborate with others</p>
        </div>
        <GradientCard className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Study Groups</h2>
            </div>
            <div>
              <button 
                onClick={() => {
                  console.log('Create group clicked from Dashboard');
                  navigate('/study-groups/create');
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create New Group
              </button>
            </div>
          </div>

          <div className="text-center py-6 text-muted-foreground">
            <p>No study groups yet</p>
            <p className="text-sm">Create or join a group to study together!</p>
          </div>
        </GradientCard>
      </div>

      {/* Featured Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Featured Courses</h2>
            <p className="text-[#B3B3B3]">Continue learning with these recommended courses</p>
          </div>
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-[#2DD4BF]/10"
            onClick={handleViewAllCourses}
          >
            View All
          </Badge>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
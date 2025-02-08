import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getUserProfile } from '@/services/databaseService';
import { auth } from '@/config/firebase';
import { UserProfile } from '@/types/user';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Twitter,
  Trophy,
  BookOpen,
  Brain,
  Flame,
  TrendingUp,
  Clock,
  Target,
  Award,
  Medal
} from 'lucide-react';

// Demo data for new users
const demoAnalysis = {
  learningStreak: [2, 4, 3, 5, 4, 6, 4],
  topicPerformance: [
    { topic: 'JavaScript', score: 85, total: 100 },
    { topic: 'React', score: 92, total: 100 },
    { topic: 'TypeScript', score: 78, total: 100 },
    { topic: 'Node.js', score: 88, total: 100 }
  ],
  weeklyActivity: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.0 },
    { day: 'Fri', hours: 2.7 },
    { day: 'Sat', hours: 4.1 },
    { day: 'Sun', hours: 3.5 }
  ],
  strengthAreas: [
    { topic: 'Problem Solving', percentage: 92 },
    { topic: 'Code Quality', percentage: 88 },
    { topic: 'Debugging', percentage: 85 },
    { topic: 'Testing', percentage: 78 }
  ],
  recentScores: [
    { quiz: 'JavaScript Basics', score: 95, date: '2025-01-10' },
    { quiz: 'React Hooks', score: 88, date: '2025-01-09' },
    { quiz: 'TypeScript Types', score: 92, date: '2025-01-08' },
    { quiz: 'Node.js Fundamentals', score: 85, date: '2025-01-07' }
  ]
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userProfile = await getUserProfile(user.uid);
        // Add demo analysis for new users
        if (userProfile && !userProfile.analysis) {
          userProfile.analysis = demoAnalysis;
        }
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center p-8">Profile not found</div>;
  }

  const renderProgressBar = (percentage: number) => (
    <div className="w-full bg-[#2a324b]/40 rounded-2xl h-2">
      <div
        className="bg-emerald-400/80 h-2 rounded-2xl transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="p-6 mb-6 bg-[#0B1120] border-0 shadow-lg">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24">
            {profile.profileImage ? (
              <AvatarImage src={profile.profileImage} alt={profile.name} />
            ) : (
              <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <p className="text-emerald-400/80">{profile.role}</p>
            {profile.bio && <p className="mt-2 text-gray-400">{profile.bio}</p>}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Card */}
        <Card className="relative p-6 bg-[#0B1120] border-0 shadow-lg group hover:bg-[#0d1328] transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-white">Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover:bg-[#232937] transition-colors duration-300">
                <Trophy className="text-yellow-500/90 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Level</p>
                <p className="text-lg font-semibold text-white">{profile.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover:bg-[#232937] transition-colors duration-300">
                <BookOpen className="text-blue-400/90 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Courses</p>
                <p className="text-lg font-semibold text-white">{profile.stats?.coursesCompleted || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover:bg-[#232937] transition-colors duration-300">
                <Brain className="text-purple-400/90 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Quizzes</p>
                <p className="text-lg font-semibold text-white">{profile.stats?.quizzesTaken || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover:bg-[#232937] transition-colors duration-300">
                <Flame className="text-orange-400/90 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Streak</p>
                <p className="text-lg font-semibold text-white">{profile.stats?.streak || 0}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="relative p-6 bg-[#0B1120] border-0 shadow-lg group hover:bg-[#0d1328] transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-white">Connect</h2>
          <div className="space-y-3">
            {profile.socials?.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group/link"
              >
                <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover/link:bg-[#232937] transition-colors duration-300">
                  <Github className="h-5 w-5" />
                </div>
                GitHub
              </a>
            )}
            {profile.socials?.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group/link"
              >
                <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover/link:bg-[#232937] transition-colors duration-300">
                  <Linkedin className="h-5 w-5 text-blue-400/90" />
                </div>
                LinkedIn
              </a>
            )}
            {profile.socials?.instagram && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group/link"
              >
                <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover/link:bg-[#232937] transition-colors duration-300">
                  <Instagram className="h-5 w-5 text-pink-400/90" />
                </div>
                Instagram
              </a>
            )}
            {profile.socials?.twitter && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group/link"
              >
                <div className="p-2.5 rounded-xl bg-[#1e2432] group-hover/link:bg-[#232937] transition-colors duration-300">
                  <Twitter className="h-5 w-5 text-blue-400/90" />
                </div>
                Twitter
              </a>
            )}
            {!profile.socials?.github && !profile.socials?.linkedin && 
             !profile.socials?.instagram && !profile.socials?.twitter && (
              <p className="text-gray-500">No social links added yet</p>
            )}
          </div>
        </Card>

        {/* Learning Analysis */}
        <Card className="relative p-6 bg-[#0B1120] border-0 shadow-lg lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 text-white">Learning Analysis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Topic Performance */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-[#1e2432]">
                  <TrendingUp className="text-emerald-400/90 h-5 w-5" />
                </div>
                Topic Performance
              </h3>
              <div className="space-y-4">
                {profile.analysis?.topicPerformance.map((topic, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">{topic.topic}</span>
                      <span className="text-emerald-400/90">{topic.score}%</span>
                    </div>
                    {renderProgressBar((topic.score / topic.total) * 100)}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-[#1e2432]">
                  <Clock className="text-emerald-400/90 h-5 w-5" />
                </div>
                Weekly Activity
              </h3>
              <div className="flex items-end justify-between h-40">
                {profile.analysis?.weeklyActivity.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-emerald-400/20 rounded-t-2xl"
                      style={{ height: `${day.hours * 20}px` }}
                    />
                    <span className="text-gray-400 text-sm mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strength Areas */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-[#1e2432]">
                  <Target className="text-emerald-400/90 h-5 w-5" />
                </div>
                Strength Areas
              </h3>
              <div className="space-y-4">
                {profile.analysis?.strengthAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">{area.topic}</span>
                      <span className="text-emerald-400/90">{area.percentage}%</span>
                    </div>
                    {renderProgressBar(area.percentage)}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Quiz Scores */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-[#1e2432]">
                  <Award className="text-emerald-400/90 h-5 w-5" />
                </div>
                Recent Quiz Scores
              </h3>
              <div className="space-y-3">
                {profile.analysis?.recentScores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#0d1328] rounded-2xl">
                    <div>
                      <p className="text-white">{score.quiz}</p>
                      <p className="text-sm text-gray-400">{new Date(score.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-xl font-bold text-emerald-400/90">{score.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Interests & Goals */}
        <Card className="relative p-6 bg-[#0B1120] border-0 shadow-lg lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Interests</h2>
              <p className="text-gray-400">{profile.interests || 'No interests added yet'}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Learning Goals</h2>
              <p className="text-gray-400">{profile.goals || 'No goals added yet'}</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="relative p-6 bg-[#0B1120] border-0 shadow-lg lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <div className="space-y-4">
            {profile.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-[#0d1328] rounded-2xl">
                <div className="p-2.5 rounded-xl bg-[#0d1328] group-hover:bg-[#111a35]">
                  {activity.type === 'quiz' && <Brain className="text-purple-400/90 h-5 w-5" />}
                  {activity.type === 'course' && <BookOpen className="text-blue-400/90 h-5 w-5" />}
                  {activity.type === 'achievement' && <Trophy className="text-yellow-500/90 h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-white">{activity.description}</p>
                  <p className="text-sm text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="relative p-6 bg-[#0B1120] border-0 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Achievements</h2>
          <div className="space-y-4">
            {profile.achievements?.map((achievement, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-[#0d1328] rounded-2xl">
                <div className="p-2.5 rounded-xl bg-[#0d1328] group-hover:bg-[#111a35]">
                  <Medal className="text-yellow-500/90 h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-white">{achievement.title}</p>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
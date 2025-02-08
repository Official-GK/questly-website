import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Layers, GraduationCap, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: 'Flashcards',
    description: 'Create and study with AI-generated flashcards',
    icon: Layers,
    path: '/flashcards',
    color: 'text-blue-500',
  },
  {
    title: 'Quizzes',
    description: 'Test your knowledge with adaptive quizzes',
    icon: Brain,
    path: '/quiz',
    color: 'text-green-500',
  },
  {
    title: 'Mock Tests',
    description: 'Practice with full-length mock exams',
    icon: GraduationCap,
    path: '/mock-test',
    color: 'text-purple-500',
  },
  {
    title: 'Leaderboard',
    description: 'Compare your progress with others',
    icon: Trophy,
    path: '/leaderboard',
    color: 'text-yellow-500',
  },
];

export default function FeatureSection() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="cursor-pointer transition-all hover:shadow-lg"
          onClick={() => navigate(feature.path)}
        >
          <CardHeader>
            <feature.icon className={`h-8 w-8 ${feature.color}`} />
            <CardTitle className="mt-4">{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      ))}
    </div>
  );
}

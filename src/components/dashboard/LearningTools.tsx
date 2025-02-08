import { useNavigate } from "react-router-dom";
import { Brain, FileText, GraduationCap, Target } from "lucide-react";
import { LearningToolCard } from "./LearningToolCard";

export function LearningTools() {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Flashcards",
      description: "Create and study with interactive flashcards. Perfect for memorization and quick review.",
      icon: <Brain className="w-7 h-7 text-[#60DFFF]" />,
      path: "/flashcards",
      borderGlow: "rgba(96, 223, 255, 0.2)"
    },
    {
      title: "Quiz",
      description: "Test your knowledge with targeted quizzes. Track your progress and identify areas for improvement.",
      icon: <Target className="w-7 h-7 text-emerald-400" />,
      path: "/quiz",
      borderGlow: "rgba(16, 185, 129, 0.2)"
    },
    {
      title: "Mock Tests",
      description: "Practice with full-length mock exams. Get exam-ready with timed tests and detailed analysis.",
      icon: <GraduationCap className="w-7 h-7 text-purple-400" />,
      path: "/mock-test",
      borderGlow: "rgba(167, 139, 250, 0.2)"
    },
    {
      title: "Summary Generator",
      description: "Generate concise summaries of your study material. Save time and focus on key concepts.",
      icon: <FileText className="w-7 h-7 text-orange-400" />,
      path: "/summary",
      borderGlow: "rgba(251, 146, 60, 0.2)"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <LearningToolCard
          key={tool.title}
          title={tool.title}
          description={tool.description}
          icon={tool.icon}
          borderGlow={tool.borderGlow}
          onClick={() => navigate(tool.path)}
        />
      ))}
    </div>
  );
}

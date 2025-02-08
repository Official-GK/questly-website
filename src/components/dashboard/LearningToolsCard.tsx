import { GradientCard } from "@/components/ui/gradient-card";
import { cn } from "@/lib/utils";
import { Book, Brain, FlaskConical, Gamepad2 } from "lucide-react";

const tools = [
  {
    id: 1,
    name: "Flashcards",
    description: "Review with interactive flashcards",
    icon: Brain,
    link: "/flashcards",
  },
  {
    id: 2,
    name: "Quiz Game",
    description: "Test your knowledge with quizzes",
    icon: Gamepad2,
    link: "/quiz",
  },
  {
    id: 3,
    name: "Study Sets",
    description: "Create and manage study materials",
    icon: Book,
    link: "/study-sets",
  },
  {
    id: 4,
    name: "Practice Lab",
    description: "Hands-on coding practice",
    icon: FlaskConical,
    link: "/lab",
  },
];

interface LearningToolsCardProps {
  className?: string;
}

export function LearningToolsCard({ className }: LearningToolsCardProps) {
  return (
    <GradientCard theme="green" className={cn("group relative overflow-hidden h-full", className)}>
      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">Learning Tools</h3>
            <p className="text-[#B3B3B3]">Resources to help you learn</p>
          </div>
          <Brain className="h-8 w-8 text-emerald-400" />
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <a
                key={tool.id}
                href={tool.link}
                className="group/item flex flex-col rounded-lg bg-[#1E1E1E] p-6 transition-all hover:bg-emerald-500/10"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white">{tool.name}</h4>
                  <p className="text-sm text-[#B3B3B3]">{tool.description}</p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-opacity duration-300 group-hover/item:opacity-100" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Background Brain Icon */}
      <div className="absolute -right-8 -top-8 h-48 w-48 opacity-[0.05]">
        <Brain className="h-full w-full text-emerald-500" />
      </div>
    </GradientCard>
  );
}

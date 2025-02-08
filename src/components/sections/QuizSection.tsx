import { ChevronRight, Target } from "lucide-react";
import { GradientCard, CardIcon, CardProgress } from "@/components/ui/gradient-card";

interface QuizSectionProps {
  totalQuizzes?: number;
  completedQuizzes?: number;
  averageScore?: number;
  onClick?: () => void;
  className?: string;
}

export function QuizSection({
  totalQuizzes = 0,
  completedQuizzes = 0,
  averageScore = 0,
  onClick,
  className,
}: QuizSectionProps) {
  return (
    <GradientCard theme="green" onClick={onClick} className={className}>
      {/* Content */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardIcon icon={<Target className="w-full h-full" />} theme="green" />
            <h3 className="text-xl font-semibold text-white transition-colors duration-300">
              Quiz
            </h3>
          </div>
          <div className="rounded-full px-3 py-1 text-sm bg-gradient-to-r from-[#00B09B] to-[#96C93D] text-black">
            Avg. {averageScore}%
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#B3B3B3]">Progress</span>
            <span className="text-[#B3B3B3]">{completedQuizzes}/{totalQuizzes} quizzes</span>
          </div>
          <CardProgress value={(completedQuizzes / totalQuizzes) * 100} theme="green" />
        </div>

        {/* Arrow */}
        <div className="absolute bottom-6 right-6 transform transition-transform duration-300 group-hover:translate-x-1">
          <ChevronRight className="h-5 w-5 text-[#96C93D]" />
        </div>

        {/* Background Pattern */}
        <div className="absolute -right-8 -top-8 h-32 w-32 opacity-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Target className="h-full w-full text-[#96C93D]" />
        </div>
      </div>
    </GradientCard>
  );
}

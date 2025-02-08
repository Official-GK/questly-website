import { Brain, ChevronRight } from "lucide-react";
import { GradientCard, CardIcon, CardProgress } from "@/components/ui/gradient-card";

interface FlashcardsSectionProps {
  totalCards?: number;
  completedCards?: number;
  onClick?: () => void;
  className?: string;
}

export function FlashcardsSection({
  totalCards = 0,
  completedCards = 0,
  onClick,
  className,
}: FlashcardsSectionProps) {
  return (
    <GradientCard theme="blue" onClick={onClick} className={className}>
      {/* Content */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <CardIcon icon={<Brain className="w-full h-full" />} theme="blue" />
          <h3 className="text-xl font-semibold text-white transition-colors duration-300">
            Flashcards
          </h3>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#B3B3B3]">Progress</span>
            <span className="text-[#B3B3B3]">{completedCards}/{totalCards} cards</span>
          </div>
          <CardProgress value={(completedCards / totalCards) * 100} theme="blue" />
        </div>

        {/* Arrow */}
        <div className="absolute bottom-6 right-6 transform transition-transform duration-300 group-hover:translate-x-1">
          <ChevronRight className="h-5 w-5 text-[#60DFFF]" />
        </div>

        {/* Background Pattern */}
        <div className="absolute -right-8 -top-8 h-32 w-32 opacity-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Brain className="h-full w-full text-[#60DFFF]" />
        </div>
      </div>
    </GradientCard>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  question: string;
  answer: string;
  className?: string;
}

export function Flashcard({ question, answer, className }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={cn(
        "w-[300px] h-[200px] perspective-1000 cursor-pointer",
        className
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "tween" }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-lg flex items-center justify-center p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 text-center">
            {question}
          </h3>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rounded-lg bg-emerald-50 dark:bg-emerald-900/50 shadow-lg flex items-center justify-center p-6 rotate-y-180">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 text-center">
            {answer}
          </h3>
        </div>
      </motion.div>
    </div>
  );
}

export function FlashcardGrid({ cards }: { cards: Array<{ question: string; answer: string }> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cards.map((card, index) => (
        <Flashcard
          key={index}
          question={card.question}
          answer={card.answer}
        />
      ))}
    </div>
  );
}

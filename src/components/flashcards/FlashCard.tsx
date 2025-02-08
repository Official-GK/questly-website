import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

interface FlashCardProps {
  question: string;
  answer: string;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  className?: string;
}

export function FlashCard({
  question,
  answer,
  onCorrect,
  onIncorrect,
  className,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setIsAnswered(true);
    if (correct) {
      onCorrect?.();
    } else {
      onIncorrect?.();
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative min-h-[300px] cursor-pointer overflow-hidden rounded-lg bg-[#282828] transition-all duration-500 ${className} ${
        isAnswered ? 'pointer-events-none' : ''
      }`}
      onClick={handleFlip}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(29, 185, 84, 0.4), transparent 40%)`,
        }}
      />

      {/* Card Content */}
      <div className={`relative h-full transition-all duration-500 ${isFlipped ? 'scale-[-1]' : ''}`}>
        <div className="absolute inset-0 p-6">
          <div className={`flex h-full flex-col items-center justify-center text-center transition-all duration-500 ${
            isFlipped ? 'invisible opacity-0' : 'visible opacity-100'
          }`}>
            <h3 className="text-xl font-bold text-white">{question}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 text-[#1DB954]"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
            >
              Show Answer <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className={`flex h-full flex-col items-center justify-center space-y-6 text-center transition-all duration-500 ${
            isFlipped ? 'visible opacity-100 scale-[-1]' : 'invisible opacity-0'
          }`}>
            <p className="text-lg text-white">{answer}</p>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(false);
                }}
              >
                <X className="mr-2 h-4 w-4" /> Incorrect
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(true);
                }}
              >
                <Check className="mr-2 h-4 w-4" /> Correct
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Overlay */}
      {isAnswered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`rounded-full p-4 ${
            isCorrect ? 'bg-[#1DB954]' : 'bg-red-500'
          }`}>
            {isCorrect ? (
              <Check className="h-8 w-8 text-white" />
            ) : (
              <X className="h-8 w-8 text-white" />
            )}
          </div>
        </div>
      )}

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-lg transition-opacity duration-500 group-hover:opacity-100 opacity-0" 
           style={{ 
             boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)" 
           }} 
      />
    </div>
  );
}

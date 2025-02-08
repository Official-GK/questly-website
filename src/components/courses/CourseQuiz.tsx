import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CourseQuizProps {
  title: string;
  questions?: Question[];
  onComplete: (score: number) => void;
}

export function CourseQuiz({ title, questions = [], onComplete }: CourseQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  // If no questions are available
  if (!questions || questions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">No questions available for this quiz.</p>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const score = (correctAnswers / questions.length) * 100;
    onComplete(score);
  };

  const isAnswerCorrect = (questionId: number, answerIndex: number) => {
    if (!submitted) return null;
    const question = questions.find((q) => q.id === questionId);
    return question?.correctAnswer === answerIndex;
  };

  const canSubmit = Object.keys(answers).length === questions.length;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">{currentQuestion.question}</h3>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = isAnswerCorrect(currentQuestion.id, index);
              const isSelected = answers[currentQuestion.id] === index;
              
              return (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg border transition-colors
                    ${isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary"}
                    ${submitted && isSelected
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : ""
                    }
                    ${submitted && !isSelected && isCorrect
                      ? "border-green-500 bg-green-50/50 text-green-700"
                      : ""
                    }
                  `}
                  onClick={() => handleAnswer(index)}
                  disabled={submitted}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || submitted}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              Next
            </Button>
          )}
        </div>

        {submitted && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 font-medium text-center">
              Quiz completed! Your answers have been submitted.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

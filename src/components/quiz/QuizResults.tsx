import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { QuizQuestion, QuizAttempt } from '@/types/quiz';
import { ArrowRight, Clock, Target, Trophy } from 'lucide-react';

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetry: () => void;
}

export function QuizResults({ attempt, onRetry }: QuizResultsProps) {
  const accuracy = (attempt.correctAnswers / attempt.totalQuestions) * 100;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="p-6 bg-black/40 border-emerald-500/20">
        <h2 className="text-2xl font-bold mb-4 text-zinc-200">Quiz Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <div>
              <p className="text-sm text-zinc-400">Score</p>
              <p className="text-xl font-bold text-zinc-200">{attempt.score}/{attempt.totalQuestions}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="text-blue-500" />
            <div>
              <p className="text-sm text-zinc-400">Accuracy</p>
              <p className="text-xl font-bold text-zinc-200">{accuracy.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-green-500" />
            <div>
              <p className="text-sm text-zinc-400">Time Taken</p>
              <p className="text-xl font-bold text-zinc-200">{formatTime(attempt.timeTaken)}</p>
            </div>
          </div>
        </div>
        <Progress value={accuracy} className="h-2" />
      </Card>

      {/* Detailed Review */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-200">Detailed Review</h3>
        {attempt.answers.map((answer, index) => (
          <Card key={index} className={`p-4 border-l-4 bg-black/40 border-emerald-500/20 ${
            answer.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
          }`}>
            <p className="font-medium mb-2 text-zinc-200">{answer.question.question}</p>
            <div className="space-y-1 text-sm">
              <p className="text-zinc-300">Your answer: <span className={answer.isCorrect ? 'text-green-500' : 'text-red-500'}>
                {answer.userAnswer}
              </span></p>
              {!answer.isCorrect && (
                <p className="text-green-500">Correct answer: {answer.question.correctAnswer}</p>
              )}
              <p className="text-zinc-400 mt-2">{answer.question.explanation}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={onRetry} 
          variant="outline"
          className="border-emerald-500/20 text-zinc-200 hover:bg-emerald-500/10"
        >
          Try Another Quiz
        </Button>
      </div>
    </div>
  );
}

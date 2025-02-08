import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { availableTopics } from '@/config/topics';
import { Brain, Timer, AlertCircle, Loader2 } from 'lucide-react';

interface MockTestGeneratorProps {
  onTestGenerated: (topics: string[], duration: number) => void;
  isLoading: boolean;
}

export function MockTestGenerator({ onTestGenerated, isLoading }: MockTestGeneratorProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [duration, setDuration] = useState(30);
  const { toast } = useToast();

  const handleGenerateTest = () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "No Topics Selected",
        description: "Please select at least one topic for the test.",
        variant: "destructive",
      });
      return;
    }

    onTestGenerated(selectedTopics, duration);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Generate Mock Test</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Select Topics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableTopics.map((topic) => (
                <div key={topic.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={topic.id}
                    checked={selectedTopics.includes(topic.id)}
                    onCheckedChange={(checked) => {
                      setSelectedTopics(prev =>
                        checked
                          ? [...prev, topic.id]
                          : prev.filter(id => id !== topic.id)
                      );
                    }}
                    disabled={isLoading}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={topic.id}>{topic.name}</Label>
                    <p className="text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-5 w-5" />
              <h3 className="text-lg font-medium">Test Duration: {duration} minutes</h3>
            </div>
            <Slider
              value={[duration]}
              onValueChange={([value]) => setDuration(value)}
              min={15}
              max={60}
              step={15}
              className="w-full max-w-xs"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleGenerateTest}
              disabled={selectedTopics.length === 0 || isLoading}
              className="w-full max-w-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Test...
                </>
              ) : (
                'Generate Test'
              )}
            </Button>

            {selectedTopics.length === 0 && (
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <span>Select at least one topic to generate a test</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

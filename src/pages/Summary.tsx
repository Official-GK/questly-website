import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { generateSummary } from '@/lib/gemini';
import { Card } from '@/components/ui/card';
import { Bot, Key, KeyRound, BookOpen } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Summary = () => {
  const { toast } = useToast();

  const handleSubmit = async (message: string): Promise<string> => {
    if (!message.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to summarize.",
        variant: "destructive",
      });
      return "Please enter some text to summarize.";
    }

    try {
      const summary = await generateSummary(message);
      return summary;
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
      return "Sorry, I couldn't generate a summary. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-purple to-black p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">AI Summary</h1>
        <p className="text-zinc-400 text-center mb-8">
          Enter your text and I'll create a concise summary
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-black/40 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-semibold">Smart Summary</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              I'll analyze and summarize your text
            </p>
          </Card>
          
          <Card className="p-4 bg-black/40 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <Key className="w-5 h-5" />
              <h3 className="font-semibold">Clear & Concise</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Get straight to the main points
            </p>
          </Card>
          
          <Card className="p-4 bg-black/40 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-semibold">Easy to Read</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Simple and straightforward summaries
            </p>
          </Card>
        </div>
        
        <ChatInterface
          onSubmit={handleSubmit}
          placeholder="Paste your text here (max 250 words)..."
          maxWords={250}
        />
      </div>
    </div>
  );
};

export default Summary;

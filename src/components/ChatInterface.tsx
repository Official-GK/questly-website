import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onSubmit: (message: string) => Promise<string>;
  placeholder: string;
  maxLength?: number;
  maxWords?: number;
  isLink?: boolean;
  difficulty?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSubmit,
  placeholder,
  maxLength,
  maxWords,
  isLink,
  difficulty
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = (text: string) => {
    if (maxWords) {
      const wordCount = text.trim().split(/\s+/).length;
      return wordCount <= maxWords;
    }
    if (maxLength) {
      return text.length <= maxLength;
    }
    if (isLink) {
      return text.startsWith('http://') || text.startsWith('https://');
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    if (!validateInput(input)) {
      alert(maxWords 
        ? `Please limit your input to ${maxWords} words`
        : maxLength 
        ? `Please limit your input to ${maxLength} characters`
        : 'Please enter a valid URL');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string;
      if (difficulty) {
        response = await onSubmit(input + '|' + selectedDifficulty);
      } else {
        response = await onSubmit(input);
      }

      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto space-y-4">
      <div className="flex-1 overflow-auto space-y-4 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-black/20 p-4">
        {messages.map((message, index) => (
          <Card key={index} className={`p-4 ${
            message.role === 'assistant' 
              ? 'bg-black/40 border-emerald-500/20' 
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex items-start space-x-3">
              {message.role === 'assistant' ? (
                <Bot className="w-6 h-6 text-emerald-400 mt-1" />
              ) : (
                <User className="w-6 h-6 text-emerald-400 mt-1" />
              )}
              <div className="flex-1">
                <p className="text-zinc-200 whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          </Card>
        ))}
        {isLoading && (
          <Card className="p-4 bg-black/40 border-emerald-500/20">
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6 text-emerald-400" />
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <p className="text-zinc-400">Thinking...</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4 p-4 bg-black/20 rounded-lg">
        {difficulty && (
          <div className="flex space-x-4">
            {['easy', 'medium', 'hard'].map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? "default" : "outline"}
                onClick={() => setSelectedDifficulty(diff)}
                className={`capitalize ${
                  selectedDifficulty === diff 
                    ? 'bg-emerald-500 text-black' 
                    : 'border-emerald-500/20 text-emerald-400'
                }`}
              >
                {diff}
              </Button>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-black/40 border-emerald-500/20 text-zinc-200 placeholder:text-zinc-500 min-h-[100px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-emerald-500 text-black hover:bg-emerald-600 self-end h-10"
          >
            Send
          </Button>
        </div>

        {(maxWords || maxLength) && (
          <div className="text-sm text-zinc-400 text-right">
            {maxWords ? (
              `${input.trim().split(/\s+/).length}/${maxWords} words`
            ) : (
              `${input.length}/${maxLength} characters`
            )}
          </div>
        )}
      </div>
    </div>
  );
};

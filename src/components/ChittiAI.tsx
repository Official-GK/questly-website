import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Lightbulb,
  RefreshCcw,
  Image as ImageIcon,
  Eraser,
  Rocket,
  Code,
  BookOpen,
  Brain,
  Zap,
  Maximize2,
  Minimize2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getChatResponse } from '@/services/gemini';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChittiAIProps {
  className?: string;
  position?: 'top-right' | 'bottom-right';
}

const SUGGESTIONS = [
  {
    icon: <Code className="h-3 w-3" />,
    text: "Help me understand React hooks",
    category: "Development"
  },
  {
    icon: <Rocket className="h-3 w-3" />,
    text: "Explain blockchain technology",
    category: "Technology"
  },
  {
    icon: <Brain className="h-3 w-3" />,
    text: "What are design patterns?",
    category: "Concepts"
  },
  {
    icon: <Zap className="h-3 w-3" />,
    text: "How to improve code quality?",
    category: "Best Practices"
  }
];

const CAPABILITIES = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Learning Concepts",
    description: "Clear explanations of complex topics"
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: "Code Help",
    description: "Debug and improve your code"
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Problem Solving",
    description: "Step-by-step solution guidance"
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    title: "Best Practices",
    description: "Industry-standard recommendations"
  }
];

export function ChittiAI({ className, position = 'bottom-right' }: ChittiAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m Chitti, your AI learning assistant powered by Gemini.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatResponse = (text: string): string => {
    // Skip formatting for error messages or system messages that start with emojis
    if (text.startsWith('❌') || text.startsWith('🔄') || text.startsWith('👋')) {
      return text;
    }

    // Function to add bold formatting to key phrases
    const addBoldFormatting = (text: string): string => {
      let processed = text;

      // Add bold to phrases before colons
      processed = processed.replace(/^([^:]+):/g, '**$1**:');
      
      // Add bold to key terms in parentheses
      processed = processed.replace(/\(([^)]+)\)/g, '(**$1**)');
      
      // Add bold to important technical terms
      const technicalTerms = [
        'Creational Patterns', 'Structural Patterns', 'Behavioral Patterns',
        'Singleton', 'Factory Method', 'Abstract Factory',
        'Adapter', 'Decorator', 'Facade',
        'Observer', 'Strategy', 'Command'
      ];
      
      technicalTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b(?![^<]*>)`, 'g');
        processed = processed.replace(regex, `**${term}**`);
      });

      // Clean up any duplicate bold markers
      processed = processed.replace(/\*{4}/g, '**');
      processed = processed.replace(/\*\*\s*\*\*/g, '**');
      
      return processed;
    };

    // Split the text into lines
    const lines = text.split('\n');
    
    // Keep track of numbering
    let counter = 1;
    let isInList = false;
    
    // Process each line
    return lines
      .map(line => {
        const trimmed = line.trim();
        
        // If line is empty, return empty line
        if (!trimmed) {
          isInList = false;
          return '';
        }

        // Check if this is a heading or separator line
        if (trimmed.includes('patterns are usually categorized') || 
            trimmed.startsWith('These patterns') || 
            trimmed.startsWith('It\'s important')) {
          isInList = false;
          return `\n${trimmed}`;
        }

        // Remove any existing bullet points or numbers
        let cleanLine = trimmed.replace(/^[\d.)\]]+\s*/, '').trim();
        
        // Add bold formatting to important phrases
        cleanLine = addBoldFormatting(cleanLine);

        // Add proper numbering only for list items
        if (cleanLine.includes('**') || isInList) {
          isInList = true;
          return `${counter++}. ${cleanLine}`;
        }

        // Return non-list items without numbering
        return cleanLine;
      })
      .join('\n')
      // Clean up multiple consecutive newlines
      .replace(/\n{3,}/g, '\n\n');
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { 
      role: 'user' as const, 
      content: text.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Request normal text from Gemini without markdown
      const systemMessage = "Please provide your responses in plain text with numbered points. Use colons to separate concepts from their explanations. Don't use any special formatting or markdown.";
      const response = await getChatResponse(text.trim(), systemMessage);
      const aiResponse = { 
        role: 'assistant' as const, 
        content: formatResponse(response),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '🔄 Chat cleared. How can I help you?',
        timestamp: new Date()
      }
    ]);
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className={cn(
                "fixed h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:scale-110",
                positionClasses[position],
                className
              )}
              size="icon"
            >
              <Bot className="h-7 w-7 text-primary-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chat with Chitti AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn(
          "flex flex-col gap-0 p-0 rounded-xl transition-all duration-300",
          isMaximized 
            ? "w-screen h-screen max-w-none !max-h-none rounded-none" 
            : "sm:max-w-[500px] h-[700px]"
        )}>
          <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full blur opacity-75"></div>
                  <Bot className="h-8 w-8 text-primary-foreground relative" />
                </div>
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    Chitti AI
                    <Badge variant="secondary" className="ml-2 bg-primary/10">
                      <Sparkles className="h-3 w-3 mr-1 text-primary" />
                      Gemini
                    </Badge>
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">Your intelligent learning companion</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={clearChat}
                      >
                        <Eraser className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={() => setIsMaximized(!isMaximized)}
                      >
                        {isMaximized ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isMaximized ? 'Minimize' : 'Maximize'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10"
                  onClick={() => {
                    setIsOpen(false);
                    setIsMaximized(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {messages.length === 1 && (
            <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="font-semibold mb-4">I can help you with:</h3>
              <div className="grid grid-cols-2 gap-4">
                {CAPABILITIES.map((capability, i) => (
                  <Card key={i} className="p-4 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => handleSend(`Tell me about ${capability.title}`)}>
                    <div className="flex items-start gap-3">
                      <div className="text-primary">{capability.icon}</div>
                      <div>
                        <h4 className="font-medium">{capability.title}</h4>
                        <p className="text-sm text-muted-foreground">{capability.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-2",
                    message.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "flex items-start gap-3 max-w-[85%] group",
                    message.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center",
                      message.role === 'user' 
                        ? "bg-gradient-to-r from-primary to-primary/80" 
                        : "bg-gradient-to-r from-secondary to-secondary/80"
                    )}>
                      {message.role === 'user' ? (
                        <MessageCircle className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      message.role === 'user' 
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground" 
                        : "bg-secondary"
                    )}>
                      {message.content}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground px-12">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-secondary to-secondary/80 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-secondary rounded-2xl px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="px-6 py-4 border-t bg-gradient-to-r from-primary/5 to-transparent">
              <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="text-sm bg-background hover:bg-primary/5"
                    onClick={() => handleSend(suggestion.text)}
                  >
                    {suggestion.icon}
                    <span className="ml-2">{suggestion.text}</span>
                    <Badge variant="secondary" className="ml-2 bg-primary/10">
                      {suggestion.category}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={cn(
              "border-t p-4 flex gap-2 items-center bg-gradient-to-r from-primary/5 to-transparent",
              isMaximized && "px-6"
            )}
          >
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-background border-primary/20 focus-visible:ring-primary/20"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Send className="h-4 w-4 text-primary-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

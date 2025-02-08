import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send, X } from "lucide-react";
import { learningPathQuestions, saveUserPreferences, getUserPreferences, generateLearningPath } from "@/lib/learningPath";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<{ text: string; isUser: boolean }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const { toast } = useToast();

  const formatAIResponse = (text: string): string => {
    if (text.trim().endsWith('?')) return text;

    const sentences = text.split(/(?<=[.!?])\s+/);
    
    return sentences
      .filter(sentence => sentence.trim())
      .map(sentence => `• ${sentence.trim()}`)
      .join('\n');
  };

  const onboardingMessage = formatAIResponse(
    "Hi! I'm Chitti AI Assistant, your learning assistant. I can help you create a personalized learning path. Type 'learning path' to get started, or ask me any other questions!"
  );

  useEffect(() => {
    setResponses((prev) => [...prev, { text: onboardingMessage, isUser: false }]);
  }, []);

  const handleLearningPathFlow = async (userMessage: string) => {
    if (currentQuestion === -1 && userMessage.toLowerCase() === 'learning path') {
      setCurrentQuestion(0);
      const firstQuestion = learningPathQuestions[0].question;
      setResponses((prev) => [...prev, { text: firstQuestion, isUser: false }]);
      return true;
    }

    if (currentQuestion >= 0 && currentQuestion < learningPathQuestions.length) {
      const question = learningPathQuestions[currentQuestion];
      setUserAnswers((prev) => ({
        ...prev,
        [question.type]: userMessage
      }));

      if (currentQuestion === learningPathQuestions.length - 1) {
        setIsGeneratingPath(true);
        try {
          const preferences = {
            interests: userAnswers.interests?.split(',').map((i: string) => i.trim()) || [],
            experience: userAnswers.experience,
            goals: userAnswers.goals?.split(',').map((g: string) => g.trim()) || [],
            preferredLearningStyle: userAnswers.preferredLearningStyle,
            timeCommitment: userAnswers.timeCommitment
          };
          
          saveUserPreferences(preferences);
          const learningPath = await generateLearningPath(preferences);
          
          const pathMessage = `Here's your personalized learning path for ${learningPath.topic}:\n\n` +
            learningPath.steps.map((step, index) => 
              `• ${step.title} (${step.difficulty})\n` +
              `  - Description: ${step.description}\n` +
              `  - Time: ${step.estimatedTime}\n` +
              `  - Resources: ${step.resources.join(', ')}\n`
            ).join('\n') +
            `\n• Total Duration: ${learningPath.totalDuration}\n` +
            `• Prerequisites: ${learningPath.prerequisites.join(', ')}`;
          
          setResponses((prev) => [...prev, { text: pathMessage, isUser: false }]);
          setCurrentQuestion(-1);
        } catch (error) {
          console.error('Error generating learning path:', error);
          setResponses((prev) => [...prev, { 
            text: formatAIResponse("Sorry, I encountered an error generating your learning path. Please try again."),
            isUser: false 
          }]);
        }
        setIsGeneratingPath(false);
        return true;
      }

      setCurrentQuestion(prev => prev + 1);
      const nextQuestion = learningPathQuestions[currentQuestion + 1].question;
      setResponses((prev) => [...prev, { text: nextQuestion, isUser: false }]);
      return true;
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setResponses((prev) => [...prev, { text: message, isUser: true }]);
    
    try {
      const isLearningPath = await handleLearningPathFlow(message);
      
      if (!isLearningPath) {
        const response = await fetch('/api/chat', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResponses((prev) => [...prev, { 
          text: formatAIResponse(data.response), 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }

    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-neon-purple/90 backdrop-blur-lg border border-neon-orange/20 rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-neon-orange/20">
            <h3 className="text-white font-semibold">Chitti AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-neon-orange transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {responses.map((response, index) => (
              <div key={index} className={`mb-2 ${response.isUser ? "text-right" : "text-left"}`}>
                <div className={`inline-block rounded-lg p-2 ${response.isUser ? "bg-neon-orange text-white" : "bg-white/10 text-white"}`}>
                  {response.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-neon-orange/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-orange/50"
              />
              <button
                type="submit"
                className="bg-neon-orange/20 hover:bg-neon-orange/30 text-white rounded-lg p-2 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-neon-orange text-white rounded-full p-2 hover:scale-105 transition-transform">
          Chat
        </button>
      )}
    </div>
  );
};

export default ChatBot;
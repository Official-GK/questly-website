import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Mic, Send } from "lucide-react";
import { ChittyAvatar } from "@/components/ChittyAI/ChittyAvatar";
import { getChatResponse } from "@/services/gemini";

interface Message {
  id: string;
  text: string;
  sender: "user" | "chitty";
  timestamp: Date;
}

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm Chitti AI Assistant. I can help you create quizzes and learn new things. What would you like to learn about?",
      sender: "chitty",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    try {
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsTyping(true);

      // Get response from Gemini AI
      const response = await getChatResponse(userMessage.text);

      const chittyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "chitty",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, chittyMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Chitti AI Assistant</h1>
          <p className="text-gray-400">Your personal AI assistant for quiz creation and learning</p>
        </div>

        {/* Main Chat Section */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-blue-500/20">
          <CardHeader className="border-b border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-blue-800/10">
            <div className="flex items-center gap-3">
              <ChittyAvatar isResponding={isTyping} />
              <CardTitle className="text-xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Chat with Chitti AI Assistant
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start chatting with Chitti AI Assistant to create your quiz!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    } items-start gap-2`}
                  >
                    {message.sender === "chitty" && <ChittyAvatar />}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600/20 text-white"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <ChittyAvatar isResponding={true} />
                  <div className="bg-blue-600/20 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-blue-500/20 bg-gradient-to-t from-blue-900/20 to-transparent">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  disabled={isTyping}
                >
                  <Mic className="w-5 h-5" />
                </Button>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Chitti AI Assistant to help you create a quiz..."
                  className="bg-blue-900/20 border-blue-500/30 text-white placeholder-blue-300/50 focus-visible:ring-1 focus-visible:ring-blue-500"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                  disabled={isTyping || !inputText.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AI;